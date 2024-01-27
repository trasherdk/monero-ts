"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _assert = _interopRequireDefault(require("assert"));
var _GenUtils = _interopRequireDefault(require("../../common/GenUtils"));
var _MoneroSubaddress = _interopRequireDefault(require("./MoneroSubaddress"));

/**
 * Monero account model.
 */
class MoneroAccount {









  constructor(account) {
    Object.assign(this, account);

    // deserialize balances
    if (this.balance !== undefined && typeof this.balance !== "bigint") this.balance = BigInt(this.balance);
    if (this.unlockedBalance !== undefined && typeof this.unlockedBalance !== "bigint") this.unlockedBalance = BigInt(this.unlockedBalance);

    // copy subaddresses
    if (this.subaddresses) {
      for (let i = 0; i < this.subaddresses.length; i++) {
        this.subaddresses[i] = new _MoneroSubaddress.default(this.subaddresses[i]);
      }
    }
  }

  toJson() {
    let json = Object.assign({}, this);
    if (json.balance !== undefined) json.balance = json.balance.toString();
    if (json.unlockedBalance !== undefined) json.unlockedBalance = json.unlockedBalance.toString();
    if (json.subaddresses !== undefined) {
      for (let i = 0; i < json.subaddresses.length; i++) {
        json.subaddresses[i] = json.subaddresses[i].toJson();
      }
    }
    return json;
  }

  getIndex() {
    return this.index;
  }

  setIndex(index) {
    this.index = index;
    return this;
  }

  getPrimaryAddress() {
    return this.primaryAddress;
  }

  setPrimaryAddress(primaryAddress) {
    this.primaryAddress = primaryAddress;
    return this;
  }

  getBalance() {
    return this.balance;
  }

  setBalance(balance) {
    this.balance = balance;
    return this;
  }

  getUnlockedBalance() {
    return this.unlockedBalance;
  }

  setUnlockedBalance(unlockedBalance) {
    this.unlockedBalance = unlockedBalance;
    return this;
  }

  getLabel() {
    return this.label;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  getTag() {
    return this.tag;
  }

  setTag(tag) {
    this.tag = tag;
    return this;
  }

  getSubaddresses() {
    return this.subaddresses;
  }

  setSubaddresses(subaddresses) {
    (0, _assert.default)(subaddresses === undefined || Array.isArray(subaddresses), "Given subaddresses must be undefined or an array of subaddresses");
    this.subaddresses = subaddresses;
    if (subaddresses) {
      for (let subaddress of subaddresses) {
        subaddress.setAccountIndex(this.index);
      }
    }
    return this;
  }

  toString(indent = 0) {
    let str = "";
    str += _GenUtils.default.kvLine("Index", this.getIndex(), indent);
    str += _GenUtils.default.kvLine("Primary address", this.getPrimaryAddress(), indent);
    str += _GenUtils.default.kvLine("Balance", this.getBalance(), indent);
    str += _GenUtils.default.kvLine("Unlocked balance", this.getUnlockedBalance(), indent);
    str += _GenUtils.default.kvLine("Label", this.getTag(), indent);
    str += _GenUtils.default.kvLine("Tag", this.getTag(), indent);
    if (this.getSubaddresses() !== undefined) {
      str += _GenUtils.default.kvLine("Subaddresses", "", indent);
      for (let i = 0; i < this.getSubaddresses().length; i++) {
        str += _GenUtils.default.kvLine(i + 1, "", indent + 1);
        str += this.getSubaddresses()[i].toString(indent + 2) + "\n";
      }
    }
    return str.slice(0, str.length - 1); // strip last newline
  }
}exports.default = MoneroAccount;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYXNzZXJ0IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfR2VuVXRpbHMiLCJfTW9uZXJvU3ViYWRkcmVzcyIsIk1vbmVyb0FjY291bnQiLCJjb25zdHJ1Y3RvciIsImFjY291bnQiLCJPYmplY3QiLCJhc3NpZ24iLCJiYWxhbmNlIiwidW5kZWZpbmVkIiwiQmlnSW50IiwidW5sb2NrZWRCYWxhbmNlIiwic3ViYWRkcmVzc2VzIiwiaSIsImxlbmd0aCIsIk1vbmVyb1N1YmFkZHJlc3MiLCJ0b0pzb24iLCJqc29uIiwidG9TdHJpbmciLCJnZXRJbmRleCIsImluZGV4Iiwic2V0SW5kZXgiLCJnZXRQcmltYXJ5QWRkcmVzcyIsInByaW1hcnlBZGRyZXNzIiwic2V0UHJpbWFyeUFkZHJlc3MiLCJnZXRCYWxhbmNlIiwic2V0QmFsYW5jZSIsImdldFVubG9ja2VkQmFsYW5jZSIsInNldFVubG9ja2VkQmFsYW5jZSIsImdldExhYmVsIiwibGFiZWwiLCJzZXRMYWJlbCIsImdldFRhZyIsInRhZyIsInNldFRhZyIsImdldFN1YmFkZHJlc3NlcyIsInNldFN1YmFkZHJlc3NlcyIsImFzc2VydCIsIkFycmF5IiwiaXNBcnJheSIsInN1YmFkZHJlc3MiLCJzZXRBY2NvdW50SW5kZXgiLCJpbmRlbnQiLCJzdHIiLCJHZW5VdGlscyIsImt2TGluZSIsInNsaWNlIiwiZXhwb3J0cyIsImRlZmF1bHQiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90cy93YWxsZXQvbW9kZWwvTW9uZXJvQWNjb3VudC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCBHZW5VdGlscyBmcm9tIFwiLi4vLi4vY29tbW9uL0dlblV0aWxzXCI7XG5pbXBvcnQgTW9uZXJvU3ViYWRkcmVzcyBmcm9tIFwiLi9Nb25lcm9TdWJhZGRyZXNzXCI7XG5cbi8qKlxuICogTW9uZXJvIGFjY291bnQgbW9kZWwuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbmVyb0FjY291bnQge1xuXG4gIGluZGV4OiBudW1iZXI7XG4gIHByaW1hcnlBZGRyZXNzOiBzdHJpbmc7XG4gIGJhbGFuY2U6IGJpZ2ludDtcbiAgdW5sb2NrZWRCYWxhbmNlOiBiaWdpbnQ7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRhZzogc3RyaW5nO1xuICBzdWJhZGRyZXNzZXM6IE1vbmVyb1N1YmFkZHJlc3NbXTtcbiAgXG4gIGNvbnN0cnVjdG9yKGFjY291bnQ/OiBQYXJ0aWFsPE1vbmVyb0FjY291bnQ+KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBhY2NvdW50KTtcblxuICAgIC8vIGRlc2VyaWFsaXplIGJhbGFuY2VzXG4gICAgaWYgKHRoaXMuYmFsYW5jZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0aGlzLmJhbGFuY2UgIT09IFwiYmlnaW50XCIpIHRoaXMuYmFsYW5jZSA9IEJpZ0ludCh0aGlzLmJhbGFuY2UpO1xuICAgIGlmICh0aGlzLnVubG9ja2VkQmFsYW5jZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0aGlzLnVubG9ja2VkQmFsYW5jZSAhPT0gXCJiaWdpbnRcIikgdGhpcy51bmxvY2tlZEJhbGFuY2UgPSBCaWdJbnQodGhpcy51bmxvY2tlZEJhbGFuY2UpO1xuXG4gICAgLy8gY29weSBzdWJhZGRyZXNzZXNcbiAgICBpZiAodGhpcy5zdWJhZGRyZXNzZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJhZGRyZXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zdWJhZGRyZXNzZXNbaV0gPSBuZXcgTW9uZXJvU3ViYWRkcmVzcyh0aGlzLnN1YmFkZHJlc3Nlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICB0b0pzb24oKTogYW55IHtcbiAgICBsZXQganNvbjogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcyk7XG4gICAgaWYgKGpzb24uYmFsYW5jZSAhPT0gdW5kZWZpbmVkKSBqc29uLmJhbGFuY2UgPSBqc29uLmJhbGFuY2UudG9TdHJpbmcoKTtcbiAgICBpZiAoanNvbi51bmxvY2tlZEJhbGFuY2UgIT09IHVuZGVmaW5lZCkganNvbi51bmxvY2tlZEJhbGFuY2UgPSBqc29uLnVubG9ja2VkQmFsYW5jZS50b1N0cmluZygpO1xuICAgIGlmIChqc29uLnN1YmFkZHJlc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpzb24uc3ViYWRkcmVzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGpzb24uc3ViYWRkcmVzc2VzW2ldID0ganNvbi5zdWJhZGRyZXNzZXNbaV0udG9Kc29uKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG4gIFxuICBnZXRJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmluZGV4O1xuICB9XG4gIFxuICBzZXRJbmRleChpbmRleDogbnVtYmVyKTogTW9uZXJvQWNjb3VudCB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBnZXRQcmltYXJ5QWRkcmVzcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnByaW1hcnlBZGRyZXNzO1xuICB9XG5cbiAgc2V0UHJpbWFyeUFkZHJlc3MocHJpbWFyeUFkZHJlc3M6IHN0cmluZyk6IE1vbmVyb0FjY291bnQge1xuICAgIHRoaXMucHJpbWFyeUFkZHJlc3MgPSBwcmltYXJ5QWRkcmVzcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBcbiAgZ2V0QmFsYW5jZSgpOiBiaWdpbnQge1xuICAgIHJldHVybiB0aGlzLmJhbGFuY2U7XG4gIH1cbiAgXG4gIHNldEJhbGFuY2UoYmFsYW5jZTogYmlnaW50KTogTW9uZXJvQWNjb3VudCB7XG4gICAgdGhpcy5iYWxhbmNlID0gYmFsYW5jZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBcbiAgZ2V0VW5sb2NrZWRCYWxhbmNlKCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMudW5sb2NrZWRCYWxhbmNlO1xuICB9XG4gIFxuICBzZXRVbmxvY2tlZEJhbGFuY2UodW5sb2NrZWRCYWxhbmNlOiBiaWdpbnQpOiBNb25lcm9BY2NvdW50IHtcbiAgICB0aGlzLnVubG9ja2VkQmFsYW5jZSA9IHVubG9ja2VkQmFsYW5jZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldExhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFiZWw7XG4gIH1cbiAgXG4gIHNldExhYmVsKGxhYmVsOiBzdHJpbmcpOiBNb25lcm9BY2NvdW50IHtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgXG4gIGdldFRhZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRhZztcbiAgfVxuICBcbiAgc2V0VGFnKHRhZzogc3RyaW5nKTogTW9uZXJvQWNjb3VudCB7XG4gICAgdGhpcy50YWcgPSB0YWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgXG4gIGdldFN1YmFkZHJlc3NlcygpOiBNb25lcm9TdWJhZGRyZXNzW10ge1xuICAgIHJldHVybiB0aGlzLnN1YmFkZHJlc3NlcztcbiAgfVxuICBcbiAgc2V0U3ViYWRkcmVzc2VzKHN1YmFkZHJlc3NlczogTW9uZXJvU3ViYWRkcmVzc1tdKTogTW9uZXJvQWNjb3VudCAge1xuICAgIGFzc2VydChzdWJhZGRyZXNzZXMgPT09IHVuZGVmaW5lZCB8fCBBcnJheS5pc0FycmF5KHN1YmFkZHJlc3NlcyksIFwiR2l2ZW4gc3ViYWRkcmVzc2VzIG11c3QgYmUgdW5kZWZpbmVkIG9yIGFuIGFycmF5IG9mIHN1YmFkZHJlc3Nlc1wiKTtcbiAgICB0aGlzLnN1YmFkZHJlc3NlcyA9IHN1YmFkZHJlc3NlcztcbiAgICBpZiAoc3ViYWRkcmVzc2VzKSB7XG4gICAgICBmb3IgKGxldCBzdWJhZGRyZXNzIG9mIHN1YmFkZHJlc3Nlcykge1xuICAgICAgICBzdWJhZGRyZXNzLnNldEFjY291bnRJbmRleCh0aGlzLmluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgXG4gIHRvU3RyaW5nKGluZGVudCA9IDApOiBzdHJpbmcge1xuICAgIGxldCBzdHIgPSBcIlwiO1xuICAgIHN0ciArPSBHZW5VdGlscy5rdkxpbmUoXCJJbmRleFwiLCB0aGlzLmdldEluZGV4KCksIGluZGVudCk7XG4gICAgc3RyICs9IEdlblV0aWxzLmt2TGluZShcIlByaW1hcnkgYWRkcmVzc1wiLCB0aGlzLmdldFByaW1hcnlBZGRyZXNzKCksIGluZGVudCk7XG4gICAgc3RyICs9IEdlblV0aWxzLmt2TGluZShcIkJhbGFuY2VcIiwgdGhpcy5nZXRCYWxhbmNlKCksIGluZGVudCk7XG4gICAgc3RyICs9IEdlblV0aWxzLmt2TGluZShcIlVubG9ja2VkIGJhbGFuY2VcIiwgdGhpcy5nZXRVbmxvY2tlZEJhbGFuY2UoKSwgaW5kZW50KTtcbiAgICBzdHIgKz0gR2VuVXRpbHMua3ZMaW5lKFwiTGFiZWxcIiwgdGhpcy5nZXRUYWcoKSwgaW5kZW50KTtcbiAgICBzdHIgKz0gR2VuVXRpbHMua3ZMaW5lKFwiVGFnXCIsIHRoaXMuZ2V0VGFnKCksIGluZGVudCk7XG4gICAgaWYgKHRoaXMuZ2V0U3ViYWRkcmVzc2VzKCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgc3RyICs9IEdlblV0aWxzLmt2TGluZShcIlN1YmFkZHJlc3Nlc1wiLCBcIlwiLCBpbmRlbnQpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2V0U3ViYWRkcmVzc2VzKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RyICs9IEdlblV0aWxzLmt2TGluZShpICsgMSwgXCJcIiwgaW5kZW50ICsgMSk7XG4gICAgICAgIHN0ciArPSB0aGlzLmdldFN1YmFkZHJlc3NlcygpW2ldLnRvU3RyaW5nKGluZGVudCArIDIpICsgXCJcXG5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCBzdHIubGVuZ3RoIC0gMSk7ICAvLyBzdHJpcCBsYXN0IG5ld2xpbmVcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoieUxBQUEsSUFBQUEsT0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsU0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsaUJBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDZSxNQUFNRyxhQUFhLENBQUM7Ozs7Ozs7Ozs7RUFVakNDLFdBQVdBLENBQUNDLE9BQWdDLEVBQUU7SUFDNUNDLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDLElBQUksRUFBRUYsT0FBTyxDQUFDOztJQUU1QjtJQUNBLElBQUksSUFBSSxDQUFDRyxPQUFPLEtBQUtDLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQ0QsT0FBTyxLQUFLLFFBQVEsRUFBRSxJQUFJLENBQUNBLE9BQU8sR0FBR0UsTUFBTSxDQUFDLElBQUksQ0FBQ0YsT0FBTyxDQUFDO0lBQ3ZHLElBQUksSUFBSSxDQUFDRyxlQUFlLEtBQUtGLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQ0UsZUFBZSxLQUFLLFFBQVEsRUFBRSxJQUFJLENBQUNBLGVBQWUsR0FBR0QsTUFBTSxDQUFDLElBQUksQ0FBQ0MsZUFBZSxDQUFDOztJQUV2STtJQUNBLElBQUksSUFBSSxDQUFDQyxZQUFZLEVBQUU7TUFDckIsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDRCxZQUFZLENBQUNFLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7UUFDakQsSUFBSSxDQUFDRCxZQUFZLENBQUNDLENBQUMsQ0FBQyxHQUFHLElBQUlFLHlCQUFnQixDQUFDLElBQUksQ0FBQ0gsWUFBWSxDQUFDQyxDQUFDLENBQUMsQ0FBQztNQUNuRTtJQUNGO0VBQ0Y7O0VBRUFHLE1BQU1BLENBQUEsRUFBUTtJQUNaLElBQUlDLElBQVMsR0FBR1gsTUFBTSxD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