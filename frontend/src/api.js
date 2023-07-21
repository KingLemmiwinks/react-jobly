import axios from "axios";
import { TOKEN_STORAGE_ID } from "./App.js";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export default class JoblyApi {
  static async request(endpoint, params = {}, verb = "get", allowAnonymous = false) {
    let _token =localStorage.getItem(TOKEN_STORAGE_ID)

    console.debug("API Call:", endpoint, params, verb);

    let q;

    if (allowAnonymous !== true){
      axios.defaults.headers.common = {'Authorization': `Bearer ${_token}`};        
    }

    if (verb === "get") {
      q = axios.get(`${BASE_URL}/${endpoint}`, {
        params: { ...params },
      });
    } else if (verb === "post") {        
        q = axios.post(`${BASE_URL}/${endpoint}`, { ...params });
    } else if (verb === "patch") {
      q = axios.patch(`${BASE_URL}/${endpoint}`, { ...params });
    }

    try {
      return (await q).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  static async getCompanies(name) {
    let res = await this.request("companies", { name });
    return res.companies;
  }

  static async getJobs(title) {
    let res = await this.request("jobs", { title });
    return res.jobs;
  }

  static async applyToJob(username, id) {
    let res = await this.request(`users/${username}/jobs/${id}`, {}, "post");
    return res.message;
  }

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post", true);
    return res.token;
  }

  static async register(data) {
    let res = await this.request(`users`, data, "post");
    return res.token;
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}