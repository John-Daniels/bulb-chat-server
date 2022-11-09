type socialMediaHandle = {
    url: "";
    username: "";
};

type Wallet = {
    balance: number;
};

//
interface ProfileSchema {
    firstName: string;
    lastName: string;
    username: string;
    isHireable: boolean;
    isEmailVerified: boolean;
    email: string;
    bio: string;
    avater: string;
    hasMarketPlace: boolean;
    wallet: Wallet;
    phone: string;
    password: String; // will be hidden
    location: "Lagos, Nigeria";
    socialMediaHandles: {
        github: socialMediaHandle;
        facebook: socialMediaHandle;
        linkedin: socialMediaHandle;
        // if you have more stuff add it
    };
    isAdmin: true;
}

// so the new schema is
const db = {
    users: [
        {
            username: "Johnkoder",
            email: "koder@gmail.com",
            firstName: "John Koder",
            lastName: "Daniels",
            password: "******", // will be hidden
            isHireable: true,
            isEmailVerified: true,
            avater: "img.png",
            hasMarketPlace: true,
            wallet: Number,
            phone: "0902564913",
            location: "Lagos, Nigeria",
            socialMediaHandles: {
                github: {
                    url: "",
                    username: "",
                },
                facebook: {
                    url: "",
                    username: "",
                },
                linkedin: {
                    url: "",
                    username: "",
                },
                // if you have more stuff add it
            },
            isAdmin: true,
        },
    ],
    "products": [{
        name: "instagram-clone#Flutter",
        desc: "",
        categories: [
            "flutter",
        ],
        price: "6",
        showcase: [
            "img.png"
        ],
        owner: "koder",
        rating: 4.5,
    },],
    "working on more collections": [],
};
