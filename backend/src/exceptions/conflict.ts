export class ConflictException extends Error {
    constructor(message: string, public status: number = 409) {
        super(message);
    }
}
