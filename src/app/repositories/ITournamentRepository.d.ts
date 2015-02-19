/// <reference path='../objects/Tournament/ITournament.d.ts' />
declare module tourneyTracker {
    export interface ITournamentRepository {
        get(key: string): ITournament;
        put(key: string, tournament: ITournament): void;
    }
}
