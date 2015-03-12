/// <reference path='../ISerializable.d.ts' />
/// <reference path='../IAmIdentifiable.d.ts' />

module tourneyTracker {
    export interface ChildIdStore extends Object {
        leftId?: string;
        rightId?: string;
    }
    export class Match implements ISerializable, IAmIdentifiable {
        public teamA: Team;
        public teamB: Team;
        public winner: Team;
        public loser: Team;
        public parent: Match;
        public leftChild: Match;
        public rightChild: Match;
        public id: string;

        constructor(id: string) {
            this.id = id;
        }

        public serialize(): string {
            var serializedProperties: Array<string> = [
                'id', 'leftChild', 'rightChild', 'teamA', 'teamB', 'winner', 'loser'
            ];
            var data: string = serializedProperties
                .map((propName: string): string => {
                    var sVal: string;
                    if (propName === 'id') {
                        sVal = this[propName];
                    } else {
                        var prop: ISerializable = this[propName];
                        if (prop) {
                            sVal = prop.serialize();
                        }
                    }
                    return propName + ':"' + sVal + '"';
                }, this)
                .join(',');

            return '{' + data + '}';
        }

        public deserialize(dataString: string): void {
            var data: Object = JSON.parse(dataString);

            this.id = data['id'];

            ['leftChild', 'rightChild']
                .forEach((propName: string): void => {
                    var propData: string = data[propName];
                    if (propData) {
                        var match: Match = new Match('');
                        match.deserialize(propData);
                        match.parent = this;
                        this[propName] = match;
                    }
                }, this);

            ['teamA', 'teamB']
                .forEach((propName: string): void => {
                    var propData: string = data[propName];
                    if (propData) {
                        var team: Team = new Team();
                        team.deserialize(propData);
                        this[propName] = team;
                    }
                }, this);


                if (data['winner']) {
                    var team: Team = new Team();
                    team.deserialize(data['winner']);
                    this.setWinner(team);
                }

                if (data['loser']) {
                    var team: Team = new Team();
                    team.deserialize(data['winner']);
                    this.setWinner(team);
                }
        }

        private setWinner(team: Team): void {
            this.winner = team;
            if (this.parent) {
                this.parent.updateTeams();
            }
        }

        public teamAWon(): void {
            this.setWinner(this.teamA);
        }

        public teamBWon(): void {
            this.setWinner(this.teamB);
        }

        public updateTeams(): void {
            if (this.leftChild) {
                this.teamA = this.leftChild.winner;
            }
            if (this.rightChild) {
                this.teamB = this.rightChild.winner;
            }
            if (this.parent) {
                this.parent.updateTeams();
            }
        }

        private getTeamName(team: Team): string {
            return !!team ? team.name : '???';
        }
        public getTeamNameA(): string {
            return this.getTeamName(this.teamA);
        }


        public getTeamNameB(): string {
            return this.getTeamName(this.teamB);
        }

        public isTeamAWinner(): boolean {
            return this.winner && this.winner === this.teamA;
        }

        public isTeamBWinner(): boolean {
            return this.winner && this.winner === this.teamB;
        }

        public setLeftChild(match: Match): void {
            match.parent = this;
            this.leftChild = match;
            this.teamA = match.winner;
        }

        public setRightChild(match: Match): void {
            match.parent = this;
            this.rightChild = match;
            this.teamB = match.winner;
        }
    }
}
