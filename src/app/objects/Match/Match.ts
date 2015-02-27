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
        public ids: MatchIdStore;
        public id: string;

        constructor(id: string) {
            this.ids = {
                self: id
            }
        }

        public serialize(): string {

            return '';
        }

        public deserialize(data: string): void {
            // no-op
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
