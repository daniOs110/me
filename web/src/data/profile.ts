export type ProfileLinkId = "github" | "linkedin" | "youtube" | "tiktok" | "instagram";

export type ProfileLink = {
  id: ProfileLinkId;
  href: string;
};

/**
 * Fill these in when the public profiles exist.
 * Empty hrefs are hidden on the contact page.
 */
export const profile = {
  name: "Daniel",
  email: "",
  links: [
    { id: "github", href: "" },
    { id: "linkedin", href: "" },
    { id: "youtube", href: "" },
    { id: "tiktok", href: "" },
    { id: "instagram", href: "" },
  ] satisfies ProfileLink[],
};
