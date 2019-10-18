import { Response } from "https://deno.land/std/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std/http/cookie.ts";

let response: Response = {};
const cookie: Cookie = { name: "Space", value: "Cat" };
setCookie(response, cookie);

const cookieHeader = response.headers.get("set-cookie");
console.log("Set-Cookie:", cookieHeader);