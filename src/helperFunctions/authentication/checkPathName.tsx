export const checkPathName = (pathName: string) => {
    // check if logged in or registration
    return pathName == "/login" || pathName == "/register";
};
