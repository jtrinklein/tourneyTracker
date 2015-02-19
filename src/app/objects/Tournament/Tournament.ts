/// <reference path='./ITournament.d.ts' />
/// <reference path='../Match/Match.ts' />
/// <reference path='../Team/Team.ts' />


module tourneyTracker {
    export class Tournament implements ITournament {

        private teams: Array<ITeam>;
        private levels: Array<Array<Match>>;

        constructor() {
            //no-op
            this.teams = new Array();
        }

        public serialize(): string {
            //TODO: actually serialize
            return JSON.stringify(this.levels);
        }
        public deserialize(data: string): void {
            //TODO: actually deserialize
            this.levels = JSON.parse(data);
        }

        public addTeam(name: string): void {
            this.teams.push(new Team(name));
        }

        public removeTeam(team: Team): void {
            var index: number = this.teams.indexOf(team);
            if (index > -1) {
                this.teams.splice(index, 1);
            }
        }

        public getTeams(): Array<ITeam> {
            return this.teams;
        }
        public getMatchTree(): Array<Array<Match>> {
            return this.levels;
        }

        public createMatchTree(): Array<Array<Match>> {
            var root: Match = new Match();
            var requiredLeafNodes: number = Math.ceil(this.teams.length / 2);
            var openNodes: Array<Match> = [root];
            var leafNodes: number = 1;
            while (leafNodes < requiredLeafNodes) {
                var node: Match = openNodes[0];
                var newLeaf: Match = new Match();
                openNodes.push(newLeaf);
                if (!node.leftChild) {
                    node.setLeftChild(newLeaf);
                } else {
                    node.setRightChild(newLeaf);
                    openNodes.shift();
                    leafNodes++;
                }
            }

            this.placeTeamsInOpenNodes(this.teams, openNodes);

            this.levels = this.createLevelLists(root);

            return this.levels;
        }

        private createLevelLists(rootMatch: Match): Array<Array<Match>> {
            var list: Array<Array<Match>> = [];
            var currentList: Array<Match> = [rootMatch];

            while (currentList) {
                list.unshift(currentList);
                var next: Array<Match> = [];
                currentList.forEach((m): void => {
                    if (m.leftChild) {
                        next.push(m.leftChild);
                    }

                    if (m.rightChild) {
                        next.push(m.rightChild);
                    }
                });
                currentList = (next.length > 0) ? next : null;
            }

            return list;
        }
        private placeTeamsInOpenNodes(teams: Array<Team>, openNodes: Array<Match>): void {
            var teamList = angular.copy(teams);
            if (teamList.length % 2 === 1) {
                //TODO: determine which team should get the BYE
                teamList.push(new Team('BYE'));
            }

            //TODO: randomize teams?

            var i: number = 0;
            openNodes.forEach((m: Match): void => {
                m.teamA = teamList[i++];
                m.teamB = teamList[i++];
            });
        }
    }
}
