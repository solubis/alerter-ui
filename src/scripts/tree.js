(function () {

    'use strict';

    function Tree() {
    }

    Tree.prototype.init = function (root) {
        this.forEachChild(root, function (node) {
            for (var i = 0; node.children && i < node.children.length; i++) {
                node.children[i].parent = node;
            }
        });

        this.root = root;
    }

    function shallowCopy(src, dst) {
        if (angular.isArray(src)) {
            dst = dst || [];

            for (var i = 0; i < src.length; i++) {
                dst[i] = src[i];
            }
        } else if (angular.isObject(src)) {
            dst = dst || {};

            for (var key in src) {
                if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                    dst[key] = src[key];
                }
            }
        }

        return dst || src;
    }

    Tree.prototype.forEachChild = function (node, callback) {
        var result = null;

        if (!node) {
            return;
        }

        if (typeof callback === 'function') {
            callback(node);
        }

        if (node.children != null) {
            for (var i = 0; result === null && i < node.children.length; i++) {
                result = this.forEachChild(node.children[i], callback);
            }
        }

        return result;
    }

    Tree.prototype.forEachParent = function (node, callback) {
        var current = node;

        if (!node) {
            return;
        }

        while (current.parent) {
            current = current.parent;
            if (typeof callback === 'function') {
                callback(current);
            }
        }
    }

    function searchNode(node, text) {
        var result = null;
        var child;
        var children = [];
        var regex = new RegExp(text, 'i');

        if (!node) {
            return;
        }

        if (node.children != null) {
            for (var i = 0; i < node.children.length; i++) {
                child = searchNode(node.children[i], text);

                if (child !== null) {
                    children.push(child);
                }
            }
        }

        if (node.name.match(regex) || children.length) {
            result = shallowCopy(node);
            result.expanded = true;

            if (children.length) {
                result.children = children;
            }
        }

        return result;
    }

    Tree.prototype.search = function (text) {
        return (text ? searchNode(this.root, text) : this.root);
    };

    function getNodeByName(node, text) {
        var result = null;
        var regex = new RegExp(text, 'i');

        if (!node) {
            return null;
        }

        if (node.name.match(regex)) {
            return node;
        }

        if (node.children != null) {
            for (var i = 0; result === null && i < node.children.length; i++) {
                result = getNodeByName(node.children[i], text);
            }
        }

        return result;
    }

    Tree.prototype.getNodeById = function (node, id, type) {
        var result = null;

        if (!node) {
            return null;
        }

        if (node.id === id && node.type === type) {
            return node;
        }

        if (node.children != null) {
            for (var i = 0; result === null && i < node.children.length; i++) {
                result = this.getNodeById(node.children[i], id, type);
            }
        }

        return result;
    }

    function toArray(node, level) {
        var result;
        var child;

        if (!node) {
            return;
        }

        result = [node];

        if (node.children != null) {
            for (var i = 0; i < node.children.length; i++) {
                child = toArray(node.children[i], level + 1);

                if (child !== null) {
                    result = result.concat(child);
                }
            }
        }

        return result;
    }

    Tree.prototype.toArray = function () {
        return toArray(this.root, 0);
    };

    angular.module('ui.organisation')

    .factory('Tree', function () {
        return Tree;
    });
})();
