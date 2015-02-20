declare module tourneyTracker {
    export interface ITournament {
        serialize(): string;
        deserialize(serializedData: string): void;
        nextId(): string;
    }
}
