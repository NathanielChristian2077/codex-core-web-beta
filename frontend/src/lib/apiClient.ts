// Compat: o cliente HTTP agora vive em src/api/client.ts (cookie HttpOnly + CSRF).
// Mantido aqui só para os imports antigos continuarem funcionando.
// Sem accessToken no localStorage, sem Authorization: Bearer.
export { default } from "../api/client";
