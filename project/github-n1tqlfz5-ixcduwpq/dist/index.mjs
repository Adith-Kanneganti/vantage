import { districtApps } from "school-districts";
import { XMLParser } from "fast-xml-parser";

//#region src/index.ts
const SOAP_RESPONSE_PARSER = new XMLParser({ ignoreAttributes: false });
var StudentVueSoapError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "StudentVueSoapError";
	}
};
function escapeXml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function parseSoapResponse(responseText, status) {
	let outer;
	try {
		outer = SOAP_RESPONSE_PARSER.parse(responseText);
	} catch {
		throw new StudentVueSoapError(`StudentVUE returned malformed XML (HTTP ${status}).`, "malformed");
	}
	const wrapped = outer.string ?? outer.String;
	const innerXml = typeof wrapped === "string" ? wrapped : typeof wrapped === "object" && wrapped !== null && "#text" in wrapped && typeof wrapped["#text"] === "string" ? wrapped["#text"] : void 0;
	let xml = outer;
	if (innerXml !== void 0) try {
		xml = SOAP_RESPONSE_PARSER.parse(innerXml);
	} catch {
		throw new StudentVueSoapError(`StudentVUE returned malformed service XML (HTTP ${status}).`, "malformed");
	}
	const errorMessage = xml.RT_ERROR?.["@_ERROR_MESSAGE"];
	if (typeof errorMessage === "string" && errorMessage) {
		if (/D5518-00|67139|app is deprecated/i.test(errorMessage)) throw new StudentVueSoapError("StudentVUE has deprecated this legacy service. Use StudentVUE (New) to view this information; this website cannot retrieve it through the retired service.", "deprecated");
		throw new StudentVueSoapError(`StudentVUE error: ${errorMessage}`, /invalid user id or password/i.test(errorMessage) ? "auth" : "service");
	}
	return xml;
}
async function requestStudentVueSoapAtBase(credentials, methodName, params, specificFetch = fetch) {
	const paramStr = `<Parms>${Object.entries(params).map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`).join("")}</Parms>`;
	const request = new URLSearchParams({
		userID: credentials.userId,
		password: credentials.password,
		skipLoginLog: "true",
		parent: "false",
		webServiceHandleName: "PXPWebServices",
		methodName,
		paramStr
	});
	const response = await specificFetch(`${credentials.baseUrl.replace(/\/$/, "")}/Service/PXPCommunication.asmx/ProcessWebServiceRequest`, {
		method: "POST",
		body: request,
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			"user-agent": "fast-studentvue"
		}
	});
	const responseText = await response.text();
	if (!response.ok) throw new StudentVueSoapError(`StudentVUE request failed with status ${response.status}.`, response.status === 401 || response.status === 403 ? "auth" : "http");
	return parseSoapResponse(responseText, response.status);
}
const getStudentVueBase = (email) => {
	const apps = districtApps[email.split("@")[1]];
	if (!apps) throw new Error("Unknown domain");
	const studentvue = apps.find((a) => a.app == "StudentVue");
	if (!studentvue) throw new Error("District does not use StudentVue");
	return studentvue.base;
};
var src_default = async ({ email, password }, onInvalidAuth, methodName, params = {}, specificFetch = fetch) => {
	const base = getStudentVueBase(email);
	const userID = email.split("@")[0];
	try {
		return await requestStudentVueSoapAtBase({
			baseUrl: base,
			userId: userID,
			password
		}, methodName, params, specificFetch);
	} catch (error) {
		if (error instanceof StudentVueSoapError && error.code === "auth") onInvalidAuth();
		throw error;
	}
};

//#endregion
export { StudentVueSoapError, src_default as default, getStudentVueBase, requestStudentVueSoapAtBase };