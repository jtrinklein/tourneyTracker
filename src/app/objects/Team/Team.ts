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
            this.members = new Array<Player>();
        }

        public addPlayer(player: Player): void {
            if(this.members.filter((p: Player) => {return p.email === player.email}).length > 0) {
                return;
            }
            this.members.push(player);
        }

        public serialize(): string {
            return JSON.stringify({
                id: this.id,
                name: this.name,
                wins: this.wins,
                losses: this.losses,
                ties: this.ties,
                members: this.members.map((p: Player): string => { return JSON.stringify(p); })
            });
        }

        public deserialize(data: string): void {
            var teamData: Object = JSON.parse(data);
            this.id = teamData['id'];
            this.name = teamData['name'];
            this.wins = teamData['wins'];
            this.losses = teamData['losses'];
            this.ties = teamData['ties'];
            this.members = teamData['members'].map((s: string): Player => { return JSON.parse(s); });
        }
    }
}
