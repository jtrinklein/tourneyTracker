/// <reference path='./Team/Team.ts' />

module tourneyTracker {

    export interface IMainScope extends ng.IScope {
        teams: Array<Team>;
        addTeam(name: string);
        matches: Array<Match>;
        createMatchTree(): void;
        levels: Array<Array<Match>>;
        getStyleForLevel(lvl: number): Object;
    }

    export class MainCtrl {
        public matchUnitSize: number;
        public teamHeight: number;
        public spacingValue: number;
        /* @ngInject */
        constructor(private $scope: IMainScope) {
            var _this: MainCtrl = this;

            this.teamHeight = 30;
            this.spacingValue = 8;
            this.matchUnitSize = this.teamHeight * 2 + this.spacingValue;
            $scope.teams = new Array<Team>();
            $scope.matches = new Array<Match>();
            $scope.addTeam = (name: string) => { _this.addTeam(name); };
            $scope.createMatchTree = () => { _this.createMatchTree(); };
            $scope.getStyleForLevel = (n: number): Object => { return _this.getStyleForLevel(n); };
            for(var i = 1; i <= 29; ++i) {
                this.addTeam('team' + i);
            }
            this.createMatchTree();
        }
        private calculateMarginTop(level: number): string {

            return ((Math.pow(2, level) - 1) * this.matchUnitSize / 2) + 'px';
        }
        private calculateMarginBottom(level: number): string {
            var spacing: number = this.spacingValue;
            return ((Math.pow(2, level) - 1) * this.matchUnitSize + spacing) + 'px';
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

            this.placeTeamsInOpenNodes(this.$scope.teams, openNodes);

            this.$scope.levels = this.createLevelLists(root);
        }

        private placeTeamsInOpenNodes(teams: Array<Team>, openNodes: Array<Match>): void {
            if (teams.length % 2 === 1) {
                //TODO: determine which team should get the BYE
                teams.push(new Team('BYE'));
            }

            //TODO: randomize teams?

            var i: number = 0;
            openNodes.forEach((m: Match): void => {
                m.teamA = teams[i++];
                m.teamB = teams[i++];
            });
        }
        
        private createLevelLists(rootMatch: Match): Array<Array<Match>> {
            var list: Array<Array<Match>> = [];
            var currentList: Array<Match> = [rootMatch];

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

            return list;
        }

        public addTeam(name: string): void {
            this.$scope.teams.push(new Team(name));
        }
    }
}
