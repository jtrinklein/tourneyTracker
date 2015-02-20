/// <reference path='../Player/Player.ts' />
/// <reference path='./ITeam.d.ts' />

module tourneyTracker {
    export class Team implements ITeam {
        public name: string;
        public wins: number;
        public losses: number;
        public ties: number;
        public members: Array<Player>;
        public id: string;

        constructor(name?: string) {
            this.name = name;
        }

        public addPlayer(player: Player): void {
            if(this.members.filter((p: Player) => {return p.email === player.email}).length > 0) {
                return;
            }
            this.members.push(player);
        }
    }
}
