

export const generateUserAlternalName = (username: string): string => {
    const randomDigits: number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const alternalName = `@${username.toLowerCase().replace(/\s/g, "")}_${randomDigits}`
    return alternalName;
}
