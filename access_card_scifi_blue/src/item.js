var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Button = /** @class */ (function () {
        function Button() {
            this.hiddenKeys = [];
            this.targets = {};
            this.clip = new AudioClip('sounds/use.mp3');
            this.canvas = new UICanvas();
            this.container = new UIContainerStack(this.canvas);
            this.texture = new Texture('images/Key.png');
        }
        Button.prototype.init = function (_a) {
            var _this = this;
            var inventory = _a.inventory;
            this.inventory = inventory;
            Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, function (event) {
                if (event.hit && event.hit.length < 5) {
                    var entity = engine.entities[event.hit.entityId];
                    while (entity) {
                        var target = _this.targets[entity.name];
                        if (target) {
                            var key = target[0], channel = target[1];
                            if (_this.isEquipped(key)) {
                                var useAction = channel.createAction('use', {});
                                channel.sendActions([useAction]);
                            }
                        }
                        entity = entity.getParent();
                    }
                }
            });
        };
        Button.prototype.playSound = function (key) {
            var source = new AudioSource(this.clip);
            key.addComponentOrReplace(source);
            source.playing = true;
        };
        Button.prototype.isEquipped = function (key) {
            return this.inventory.has(key.name);
        };
        Button.prototype.isHidden = function (key) {
            return this.hiddenKeys.indexOf(key) !== -1;
        };
        Button.prototype.equip = function (key) {
            if (this.isEquipped(key))
                return;
            this.inventory.add(key.name, this.texture);
            this.playSound(key);
        };
        Button.prototype.hide = function (key) {
            if (this.isHidden(key))
                return;
            this.hiddenKeys.push(key);
            var gltfShape = key.getComponent(GLTFShape);
            gltfShape.visible = false;
        };
        Button.prototype.unequip = function (key) {
            if (!this.isEquipped(key))
                return;
            this.inventory.remove(key.name);
            this.playSound(key);
        };
        Button.prototype.show = function (key) {
            if (!this.isHidden(key))
                return;
            var gltfShape = key.getComponent(GLTFShape);
            gltfShape.visible = true;
            this.hiddenKeys = this.hiddenKeys.filter(function (_key) { return _key !== key; });
        };
        Button.prototype.spawn = function (host, props, channel) {
            var _this = this;
            var key = new Entity(host.name + '-key');
            key.setParent(host);
            key.addComponent(new GLTFShape('models/Blue_Access_Card.glb'));
            key.addComponent(new OnPointerDown(function () {
                var equipAction = channel.createAction('equip', {});
                channel.sendActions([equipAction]);
            }, {
                button: ActionButton.POINTER,
                hoverText: 'Pick up',
                distance: 6
            }));
            this.targets[props.target] = [key, channel];
            channel.handleAction('equip', function (action) {
                if (!_this.isEquipped(key)) {
                    // we only equip the key for the player who triggered the action
                    if (action.sender === channel.id) {
                        _this.equip(key);
                        channel.sendActions(props.onEquip);
                    }
                    // we remove the key from the scene for everybody
                    _this.hide(key);
                }
            });
            channel.handleAction('unequip', function (action) {
                if (_this.isEquipped(key)) {
                    // we only equip the key for the player who triggered the action
                    if (action.sender === channel.id) {
                        _this.unequip(key);
                    }
                    // we remove the key from the scene for everybody
                }
                if (props.respawns == false) {
                    _this.show(key);
                }
            });
            channel.handleAction('use', function (action) {
                if (_this.isEquipped(key) && action.sender === channel.id) {
                    var unequipAction = channel.createAction('unequip', {});
                    channel.sendActions(__spreadArrays([unequipAction], (props.onUse || [])));
                }
            });
            channel.handleAction('respawn', function (action) {
                if (_this.isEquipped(key) && action.sender === channel.id) {
                    var unequipAction = channel.createAction('unequip', {});
                    channel.sendActions(__spreadArrays([unequipAction], (props.onUse || [])));
                }
                _this.show(key);
            });
        };
        return Button;
    }());
    exports.default = Button;
});
