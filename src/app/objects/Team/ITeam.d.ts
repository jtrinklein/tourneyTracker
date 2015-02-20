/// <reference path='../IAmIdentifiable.d.ts' />
/// <reference path='../Player/Player.ts' />

declare module tourneyTracker {
    export interface ITeam extends IAmIdentifiable {
        members: Array<Player>;
        wins: number;
        losses: number;
        ties: number;
        name: string;
        addPlayer(player: Player);
    }
}
