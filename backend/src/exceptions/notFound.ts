export class NotFoundException extends Error {
    constructor(message: string, public status: number = 404) {
        super(message);
    }
}
