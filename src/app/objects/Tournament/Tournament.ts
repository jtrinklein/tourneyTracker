/// <reference path='./ITournament.d.ts' />
/// <reference path='../Match/Match.ts' />
/// <reference path='../Team/Team.ts' />


module tourneyTracker {
    export class Tournament implements ITournament {

        private teams: Array<Team>;
        private levels: Array<Array<Match>>;
        private lastId: number;
        private matchRoot: Match;
        private id: string;

        constructor() {
            this.id = new Date().getTime().toString();
            this.teams = new Array<ITeam>();
            this.lastId = new Date().getTime();
        }

        public serialize(): string {

            return JSON.stringify({
                id: this.id,
                teams: this.teams.map((team: Team): string => { return team.serialize(); }, this),
                matchRoot: this.matchRoot.serialize()
            });
        }

        public deserialize(dataString: string): void {
            var data: Object = JSON.parse(dataString);
            this.id = data['id'];
            this.teams = data['teams']
                .map((tData: string): Team => {
                    var t: Team = new Team();
                    t.deserialize(tData);
                    return t;
                });
            this.matchRoot = new Match('');
            this.matchRoot.deserialize(data['matchRoot']);
            this.createLevelLists(this.matchRoot);
        }

        public nextId(): string {
            this.lastId++;
            return this.lastId.toString();
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

        private createMatch(): Match {
            return new Match(this.nextId());
        }

        public createMatchTree(): Array<Array<Match>> {
            this.matchRoot = this.createMatch();
            var requiredLeafNodes: number = Math.ceil(this.teams.length / 2);
            var openNodes: Array<Match> = [this.matchRoot];
            var leafNodes: number = 1;
            while (leafNodes < requiredLeafNodes) {
                var node: Match = openNodes[0];
                var newLeaf: Match = this.createMatch();
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

            this.levels = this.createLevelLists(this.matchRoot);

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
