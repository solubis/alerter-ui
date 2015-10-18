
(function () {

    'use strict';

    angular.module('ui.organisation', [])

    .factory('Organisation', function (Tree) {
        /*
         Make tree from organisation where organisation is :
         [
         {name:'H1', id:1, groups:[{name:'G1, id: 11, users:[{login:'U1', fullName: 'User One'}]} ]},
         {name:'H2': id:2, groups:[]}
         ]
         */

        function Organisation(organisation, name) {

            function convertUser(user) {
                return {
                    name: user.fullName,
                    type: 'user',
                    id: user.login,
                    assignable: false
                };
            }

            function convertGroup(group) {
                var node = {
                    type: 'group',
                    name: group.name,
                    id: group.id,
                    assignable: false,
                    children: []
                };

                angular.forEach(group.groups, function (item) {
                    node.children.push(convertGroup(item));
                });

                angular.forEach(group.users, function (item) {
                    node.children.push(convertUser(item));
                });

                return node;
            }

            function convertGroups(groupsArray) {
                var nodes = [];

                angular.forEach(groupsArray, function (group) {
                    nodes.push(convertGroup(group));
                });

                return nodes;
            }

            function convertHierarchies(hierarchiesArray) {
                var hierarchies = [];

                angular.forEach(hierarchiesArray, function (hierarchy) {
                    hierarchies.push({
                        type: 'hierarchy',
                        children: convertGroups(hierarchy.groups),
                        name: hierarchy.name,
                        id: hierarchy.id
                    });
                });

                return hierarchies;
            }

            this.init({
                type: 'root',
                name: name || 'Root',
                expanded: true,
                children: convertHierarchies(organisation)
            });
        }

        Organisation.prototype = new Tree();

        Organisation.prototype.getNodeInHierarchy = function (hierarchyId, groupId, userLogin) {
            var hierarchy = this.getNodeById(this.root, hierarchyId, 'hierarchy');
            var group = this.getNodeById(hierarchy, groupId, 'group');
            var user = this.getNodeById(group, userLogin, 'user');

            this.forEachParent(user || group || hierarchy, function (node) {
                node.expanded = true;
            });

            return user || group || hierarchy;
        };

        Organisation.prototype.getUserGroupInHierarchy = function (hierarchyId, userLogin) {
            var hierarchy = this.getNodeById(this.root, hierarchyId, 'hierarchy');
            var user = this.getNodeById(hierarchy, userLogin, 'user');

            return user && user.parent;
        };

        Organisation.prototype.getUserGroups = function (userLogin) {
            var _this = this;
            var groups = [];

            angular.forEach(this.root.children, function (hierarchy) {
                var group = _this.getUserGroupInHierarchy(hierarchy.id, userLogin);

                if (group) {
                    groups.push(group);
                }
            })

            angular.forEach(groups, function (group) {
                group.assignable = true;
                _this.forEachChild(group, function (node) {
                    node.assignable = true;
                })
            })

            return groups;
        }


        return Organisation;
    })

    .directive('selectOrganisation', function (Organisation) {
        return {
            restrict: 'AE',
            require: ['ngModel', '^^?form'],
            scope: {
                assignee: '=ngModel',
                organisationData: '=selectOrganisation',
                ngDisabled: '=',
                requiredSelection: '@'
            },
            link: function (scope, element, attrs, controllers) {
                var ngModelController = controllers[0];
                var formController = controllers[1];
                var requiredFields = scope.requiredSelection ? scope.requiredSelection.split(',') : [];

                scope.$watch('assignee', function (newValue, oldValue) {
                    var valid = true;

                    if ((attrs.required || newValue) && requiredFields.length) {
                        angular.forEach(requiredFields, function (fieldName) {
                            if (!newValue || !newValue[fieldName]) {
                                valid = false;
                            }
                        });
                    }

                    ngModelController.$setValidity('organisation', valid);

                    if (newValue !== oldValue) {
                        ngModelController.$setDirty();
                    }
                });

                element.bind('keydown', function (e) {
                    /* User pressed arrow down */
                    if (e.which === 40) {

                        e.preventDefault();
                        e.stopPropagation();

                        if (!scope.isDropdownOpen) {
                            scope.$apply(function () {
                                scope.isDropdownOpen = true;
                            });
                        }
                    }
                });

                if (formController) {
                    formController.$addControl(ngModelController)
                }
            },
            controller: function ($scope, $element) {
                var organisation;
                var selectedNode;

                function onDblClick() {
                    $scope.isDropdownOpen = false;
                }

                function getIconClass(node) {
                    return node.type === 'user' ? 'md md-person' : (node.type === 'root' ? 'md md-home' : 'md md-group-work');
                }

                $element.find('input')
                    .bind('click', function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                $scope.search = function () {
                    $scope.organisation = organisation.search($scope.searchText);
                };

                $scope.$watch('organisationData', function (value) {
                    if (value) {
                        if (!value instanceof Organisation) {
                            throw new Error('Passed data is not type Organisation');
                        }

                        organisation = value;

                        $scope.search();

                        if ($scope.assignee) {
                            selectedNode = organisation.getNodeInHierarchy($scope.assignee.hierarchyId, $scope.assignee.groupId, $scope.assignee.userLogin);

                            if (selectedNode) {
                                selectedNode.selected = true;
                            }
                        }
                    }
                });

                $scope.options = {
                    collapsible: true,
                    showRoot: false,
                    getIconClass: getIconClass,
                    nodeClassProperty: 'type',
                    displayProperty: 'name',
                    onDblClick: onDblClick
                };
            },
            templateUrl: 'template/organisation/select-organisation.tpl.html'
        };
    })

    .value('treeViewDefaults', {
        iconClassProperty: 'type',
        displayProperty: 'name',
        collapsible: true
    })

    .directive('treeView', function ($q, treeViewDefaults, Tree) {
        return {
            restrict: 'EA',
            scope: {
                treeView: '=',
                treeViewOptions: '=',
                ngModel: '='
            },
            replace: true,
            template: '<div class="tree"><div tree-view-node="treeView" tabindex="-1"></div></div>',
            controller: function ($scope, $element) {
                var self = this;
                var selectedNode;
                var options;
                var nodes = new Tree($scope.treeView)
                    .toArray();

                options = angular.extend({}, treeViewDefaults, $scope.treeViewOptions);

                $scope.$watch('treeViewOptions', function (treeViewOptions) {
                    angular.extend(options, treeViewOptions);
                });

                this.selectNode = function (node) {
                    selectedNode = node;

                    if (typeof options.onNodeSelect === 'function') {
                        options.onNodeSelect(node);
                    }
                };

                this.dblClicked = function (node) {
                    if (typeof options.onDblClick === 'function') {
                        options.onDblClick(node);
                    }

                    self.updateModel(node);
                };

                this.updateModel = function (node) {
                    var current;
                    var model = {};

                    model.userLogin = (node.type === 'user' ? node.id : null);
                    model.userFullName = (node.type === 'user' ? node.name : null);
                    model.groupId = (node.type === 'group' ? node.id : (node.parent && node.parent.type === 'group' ? node.parent.id : null));
                    model.groupName = (node.type === 'group' ? node.name : (node.parent && node.parent.type === 'group' ? node.parent.name : null));

                    current = node;

                    while (current && current.type !== 'hierarchy') {
                        current = current.parent;
                    }

                    model.hierarchyId = current ? current.id : null;
                    model.hierarchyName = current ? current.name : null;

                    if (model.userLogin === null && model.groupId === null && model.hierarchyId === null) {
                        model = undefined;
                    } else {
                        model.assignable = node.assignable;
                    }

                    $scope.ngModel = model;
                };

                this.isSelected = function (node) {
                    return node === selectedNode;
                };

                this.getOptions = function () {
                    return options;
                };

                this.selectNextNode = function () {
                    var index = nodes.indexOf(selectedNode);

                    if (index < nodes.length - 1) {
                        self.selectNode(nodes[index + 1]);
                    }
                };

                this.selectPreviousNode = function () {
                    var index = nodes.indexOf(selectedNode);

                    if (index > 0) {
                        self.selectNode(nodes[index - 1]);
                    }
                };

                $element.bind('keydown', function (e) {
                    if (/(38|40|13)/.test(e.which)) {

                        e.preventDefault();
                        e.stopPropagation();

                        $scope.$apply(function () {

                            switch (e.keyCode) {
                            case (13):
                                self.dblClicked();
                                break;
                            case (40):
                                self.selectNextNode();
                                break;
                            case (38):
                                self.selectPreviousNode();
                                break;
                            }
                        });
                    }
                });
            }
        };
    })

    .directive('treeViewNode', ['$q', '$compile', function ($q, $compile) {
        return {
            restrict: 'A',
            require: '^treeView',
            scope: {
                node: '=treeViewNode'
            },
            link: function (scope, element, attrs, controller) {
                var options = controller.getOptions();
                var template;

                scope.$watch('node', function (node) {
                    if (node) {
                        scope.expanded = node.expanded || options.collapsible === false;

                        angular.forEach(node.children, function (child) {
                            child.parent = scope.node;
                        });

                        if (node.selected) {
                            controller.selectNode(node, element);
                        }
                    }
                });

                scope.getIconClass = (typeof options.getIconClass === 'function') ? options.getIconClass : function (node) {
                    return (node[options.iconClassProperty] ? node[options.iconClassProperty] : 'md md-insert-drive-file');
                };

                scope.getNodeClass = (typeof options.getNodeClass === 'function') ? options.getNodeClass : function (node) {
                    return (node[options.nodeClassProperty] ? node[options.nodeClassProperty] : 'node');
                };

                scope.hasChildren = function () {
                    return Boolean(scope.node && (scope.node.children && scope.node.children.length));
                };

                scope.selectNode = function (event) {
                    event.preventDefault();

                    if (options.collapsible) {
                        scope.expanded = true;
                    }

                    controller.selectNode(scope.node, element);
                };

                scope.dblClickNode = function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    controller.dblClicked(scope.node);
                };

                scope.isSelected = function (node) {
                    return controller.isSelected(node);
                };

                template = '<div ng-if="node" class="tree-node" ng-class="getNodeClass(node)">' +
                    '<div ng-if="node.show !== false" class="tree-node-header" ng-click="selectNode($event)" ng-dblclick="dblClickNode($event)" ng-class="{ selected: isSelected(node), assignable: node.assignable }">' +
                    '<i ng-class="getIconClass(node)"></i> ' +
                    '<span class="tree-node-name">{{ node.' + options.displayProperty + ' }}</span> ' +
                    '</div>' +
                    '<div class="tree-node-content"' + (options.collapsible ? ' ng-show="expanded"' : '') + '>' +
                    '<div ng-repeat="child in node.children" tree-view-node="child" tabindex="-1">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div ng-if="!node" translate class="loading">No items match your query</div>';

                $compile(template)(scope, function (clone) {
                    element.append(clone);
                });
            }
        };
    }]);

})();
