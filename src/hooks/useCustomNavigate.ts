// // hooks/useCustomNavigate.ts
// import { useNavigate as useRouterNavigate } from "react-router-dom";

// let navigate: ReturnType<typeof useRouterNavigate>;

// export const setNavigate = (nav: ReturnType<typeof useRouterNavigate>) => {
//   navigate = nav;
// };

// export const useCustomNavigate = () => {
//   if (!navigate) {
//     throw new Error("Navigation not initialized");
//   }
//   return navigate;
// };
