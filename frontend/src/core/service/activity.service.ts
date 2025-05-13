import { api, getAuthorization } from "./api";

export const ActivityService = {
    saveActivity: (
        type: string,
        description: string,
        documentName?: string
    ) => {
        const data = {
            type,
            description,
            documentName,
        };
        api.post("/activity", JSON.stringify(data), getAuthorization())
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
};
