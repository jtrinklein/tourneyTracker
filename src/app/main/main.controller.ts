/// <reference path='./Team/Team.ts' />

module tourneyTracker {
    export class Match {
        public teamA: Team;
        public teamB: Team;
        public winner: Team;
        public loser: Team;
        public parent: Match;
        public leftChild: Match;
        public rightChild: Match;

        constructor(teamA?: Team, teamB?: Team) {
            this.teamA = teamA;
            this.teamB = teamB;

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
    export interface IMainScope extends ng.IScope {
        teams: Array<Team>;
        addTeam(name: string);
        matches: Array<Match>;
        createMatchTree(): void;
        levels: Array<Array<Match>>;
        getStyleForLevel(lvl: number): Object;
    }

    export class MainCtrl {
        /* @ngInject */
        constructor(private $scope: IMainScope) {
            var _this: MainCtrl = this;
            $scope.teams = new Array<Team>();
            $scope.matches = new Array<Match>();
            $scope.addTeam = (name: string) => { _this.addTeam(name); };
            $scope.createMatchTree = () => { _this.createMatchTree(); };
            $scope.getStyleForLevel = (n: number): Object => { return _this.getStyleForLevel(n); };
            this.addTeam('team1');
            this.addTeam('team2');
            this.addTeam('team3');
            this.addTeam('team4');
            this.addTeam('team5');
            this.addTeam('team6');
            this.addTeam('team7');
            this.addTeam('team8');
            this.addTeam('team9');
            this.createMatchTree();
        }
        private calculateMarginTop(level: number): string {
            return ((Math.pow(2, level) - 1) * 40) + 'px';
        }
        private calculateMarginBottom(level: number): string {
            return (Math.pow(2, level + 1) * 40 - 60) + 'px';
        }
        public getStyleForLevel(level: number): Object {
            return {
                'margin-top': this.calculateMarginTop(level),
                'margin-bottom': this.calculateMarginBottom(level)
            };
        }

        public createMatchTree(): void {
            var root: Match = new Match();
            var requiredLeafNodes: number = Math.ceil(this.$scope.teams.length / 2);
            console.log(requiredLeafNodes);
            var openNodes: Array<Match> = [root];
            var leafNodes: number = 1;
            while(leafNodes < requiredLeafNodes) {
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
            var teams: Array<Team> = this.$scope.teams;
            if (teams.length % 2 === 1) {
                teams.push(new Team('BYE'));
            }
            var i: number = 0;
            openNodes.forEach((m: Match): void => {
                m.teamA = teams[i++];
                m.teamB = teams[i++];
            });

            var list: Array<Array<Match>> = [];
            var currentList: Array<Match> = [root];

            while(currentList) {
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

            this.$scope.levels = list;
        }

        public addTeam(name: string): void {
            this.$scope.teams.push(new Team(name));
        }
    }
}
