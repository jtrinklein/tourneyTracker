declare module tourneyTracker {
    export interface ISerializable {
        serialize(): string;
        deserialize(data: string): void;
    }
}
