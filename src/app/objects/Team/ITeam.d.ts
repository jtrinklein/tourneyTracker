/// <reference path='../Player/Player.ts' />
declare module tourneyTracker {
    export interface ITeam {
        members: Array<Player>;
        wins: number;
        losses: number;
        ties: number;
        name: string;
        addPlayer(player: Player);
    }
}
