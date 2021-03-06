/// <reference path='../Player/Player.ts' />

module tourneyTracker {
    export interface ITeam {
        members: Array<Player>;
        wins: number;
        losses: number;
        ties: number;
        name: string;
        addPlayer(player: Player);
    }
    export class Team implements ITeam {
        public wins: number;
        public losses: number;
        public ties: number;
        public members: Array<Player>;

        constructor(public name: string) {

        }

        public addPlayer(player: Player): void {
            if(this.members.filter((p: Player) => {return p.email === player.email}).length > 0) {
                return;
            }
            this.members.push(player);
        }
    }
}
