"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _MoneroError = _interopRequireDefault(require("../../common/MoneroError"));

var _MoneroOutputWallet = _interopRequireDefault(require("./MoneroOutputWallet"));


var _MoneroTxQuery = _interopRequireDefault(require("./MoneroTxQuery"));

/**
 * Configuration to query wallet outputs.
 */
class MoneroOutputQuery extends _MoneroOutputWallet.default {






  /**
   * <p>Construct the output query.</p>
   * 
   * <p>Example:</p>
   * 
   * <code>
   * &sol;&sol; get available outputs in account 0 with a minimum amount<br>
   * let outputs = await wallet.getOutputs({<br>
   * &nbsp;&nbsp; isSpent: false,<br>
   * &nbsp;&nbsp; isLocked: false,<br>
   * &nbsp;&nbsp; accountIndex: 0,<br>
   * &nbsp;&nbsp; minAmount: BigInt("750000")<br>
   * });
   * </code>
   * 
   * <p>All configuration is optional.  All outputs are returned except those that don't meet criteria defined in this query.</p>
   * 
   * @param {MoneroOutputQuery} [config] - output query configuration (optional)
   * @param {number} config.accountIndex - get outputs in this account index
   * @param {number} config.subaddressIndex - get outputs in this subaddress index
   * @param {number[]} config.subaddressIndices - get outputs in these subaddress indices
   * @param {bigint} config.amount - get outputs with this amount
   * @param {bigint} config.minAmount - get outputs with amount greater than or equal to this amount
   * @param {bigint} config.maxAmount - get outputs with amount less than or equal to this amount
   * @param {boolean} config.isSpent - get spent xor unspent outputs
   * @param {boolean} config.isFrozen - get frozen xor thawed outputs
   * @param {MoneroKeyImage} config.keyImage - get outputs with a key image matching fields defined in this key image
   * @param {string} config.keyImage.hex - get outputs with this key image hex
   * @param {string} config.keyImage.signature - get outputs with this key image signature
   * @param {MoneroTxQuery} config.txQuery - get outputs whose tx match this tx query
   */
  constructor(query) {
    super(query);
    if (this.minAmount !== undefined && typeof this.minAmount !== "bigint") this.minAmount = BigInt(this.minAmount);
    if (this.maxAmount !== undefined && typeof this.maxAmount !== "bigint") this.maxAmount = BigInt(this.maxAmount);
    if (this.txQuery && !(this.txQuery instanceof _MoneroTxQuery.default)) this.txQuery = new _MoneroTxQuery.default(this.txQuery);
    if (this.txQuery) this.txQuery.setOutputQuery(this);
    if (this.isLocked !== undefined) throw new _MoneroError.default("isLocked must be part of tx query, not output query");
  }

  copy() {
    return new MoneroOutputQuery(this);
  }

  toJson() {
    let json = Object.assign({}, this, super.toJson());
    if (this.getMinAmount() !== undefined) json.minAmount = this.getMinAmount().toString();
    if (this.getMaxAmount() !== undefined) json.maxAmount = this.getMaxAmount().toString();
    delete json.txQuery;
    return json;
  }

  getMinAmount() {
    return this.minAmount;
  }

  setMinAmount(minAmount) {
    this.minAmount = minAmount;
    return this;
  }

  getMaxAmount() {
    return this.maxAmount;
  }

  setMaxAmount(maxAmount) {
    this.maxAmount = maxAmount;
    return this;
  }

  getTxQuery() {
    return this.txQuery;
  }

  setTxQuery(txQuery) {
    this.txQuery = txQuery === undefined ? undefined : txQuery instanceof _MoneroTxQuery.default ? txQuery : new _MoneroTxQuery.default(txQuery);
    if (txQuery) this.txQuery.outputQuery = this;
    return this;
  }

  getSubaddressIndices() {
    return this.subaddressIndices;
  }

  setSubaddressIndices(subaddressIndices) {
    this.subaddressIndices = subaddressIndices;
    return this;
  }

  meetsCriteria(output, queryParent = true) {
    if (!(output instanceof _MoneroOutputWallet.default)) throw new Error("Output not given to MoneroOutputQuery.meetsCriteria(output)");

    // filter on output
    if (this.getAccountIndex() !== undefined && this.getAccountIndex() !== output.getAccountIndex()) return false;
    if (this.getSubaddressIndex() !== undefined && this.getSubaddressIndex() !== output.getSubaddressIndex()) return false;
    if (this.getAmount() !== undefined && this.getAmount() !== output.getAmount()) return false;
    if (this.getIsSpent() !== undefined && this.getIsSpent() !== output.getIsSpent()) return false;
    if (this.getIsFrozen() !== undefined && this.getIsFrozen() !== output.getIsFrozen()) return false;

    // filter on output's key image
    if (this.getKeyImage() !== undefined) {
      if (output.getKeyImage() === undefined) return false;
      if (this.getKeyImage().getHex() !== undefined && this.getKeyImage().getHex() !== output.getKeyImage().getHex()) return false;
      if (this.getKeyImage().getSignature() !== undefined && this.getKeyImage().getSignature() !== output.getKeyImage().getSignature()) return false;
    }

    // filter on extensions
    if (this.getSubaddressIndices() !== undefined && !this.getSubaddressIndices().includes(output.getSubaddressIndex())) return false;

    // filter with tx query
    if (this.getTxQuery() && !this.getTxQuery().meetsCriteria(output.getTx(), false)) return false;

    // filter on remaining fields
    if (this.getMinAmount() !== undefined && (output.getAmount() === undefined || output.getAmount() < this.getMinAmount())) return false;
    if (this.getMaxAmount() !== undefined && (output.getAmount() === undefined || output.getAmount() > this.getMaxAmount())) return false;

    // output meets query
    return true;
  }

  // -------------------- OVERRIDE COVARIANT RETURN TYPES ---------------------

  setTx(tx) {
    super.setTx(tx);
    return this;
  }

  setAccountIndex(accountIndex) {
    super.setAccountIndex(accountIndex);
    return this;
  }

  setSubaddressIndex(subaddressIndex) {
    super.setSubaddressIndex(subaddressIndex);
    return this;
  }

  setIsSpent(isSpent) {
    super.setIsSpent(isSpent);
    return this;
  }

  setIsFrozen(isFrozen) {
    super.setIsFrozen(isFrozen);
    return this;
  }

  setKeyImage(keyImage) {
    super.setKeyImage(keyImage);
    return this;
  }

  setAmount(amount) {
    super.setAmount(amount);
    return this;
  }

  setIndex(index) {
    super.setIndex(index);
    return this;
  }

  setRingOutputIndices(ringOutputIndices) {
    super.setRingOutputIndices(ringOutputIndices);
    return this;
  }

  setStealthPublicKey(stealthPublicKey) {
    super.setStealthPublicKey(stealthPublicKey);
    return this;
  }
}exports.default = MoneroOutputQuery;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfTW9uZXJvRXJyb3IiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9Nb25lcm9PdXRwdXRXYWxsZXQiLCJfTW9uZXJvVHhRdWVyeSIsIk1vbmVyb091dHB1dFF1ZXJ5IiwiTW9uZXJvT3V0cHV0V2FsbGV0IiwiY29uc3RydWN0b3IiLCJxdWVyeSIsIm1pbkFtb3VudCIsInVuZGVmaW5lZCIsIkJpZ0ludCIsIm1heEFtb3VudCIsInR4UXVlcnkiLCJNb25lcm9UeFF1ZXJ5Iiwic2V0T3V0cHV0UXVlcnkiLCJpc0xvY2tlZCIsIk1vbmVyb0Vycm9yIiwiY29weSIsInRvSnNvbiIsImpzb24iLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRNaW5BbW91bnQiLCJ0b1N0cmluZyIsImdldE1heEFtb3VudCIsInNldE1pbkFtb3VudCIsInNldE1heEFtb3VudCIsImdldFR4UXVlcnkiLCJzZXRUeFF1ZXJ5Iiwib3V0cHV0UXVlcnkiLCJnZXRTdWJhZGRyZXNzSW5kaWNlcyIsInN1YmFkZHJlc3NJbmRpY2VzIiwic2V0U3ViYWRkcmVzc0luZGljZXMiLCJtZWV0c0NyaXRlcmlhIiwib3V0cHV0IiwicXVlcnlQYXJlbnQiLCJFcnJvciIsImdldEFjY291bnRJbmRleCIsImdldFN1YmFkZHJlc3NJbmRleCIsImdldEFtb3VudCIsImdldElzU3BlbnQiLCJnZXRJc0Zyb3plbiIsImdldEtleUltYWdlIiwiZ2V0SGV4IiwiZ2V0U2lnbmF0dXJlIiwiaW5jbHVkZXMiLCJnZXRUeCIsInNldFR4IiwidHgiLCJzZXRBY2NvdW50SW5kZXgiLCJhY2NvdW50SW5kZXgiLCJzZXRTdWJhZGRyZXNzSW5kZXgiLCJzdWJhZGRyZXNzSW5kZXgiLCJzZXRJc1NwZW50IiwiaXNTcGVudCIsInNldElzRnJvemVuIiwiaXNGcm96ZW4iLCJzZXRLZXlJbWFnZSIsImtleUltYWdlIiwic2V0QW1vdW50IiwiYW1vdW50Iiwic2V0SW5kZXgiLCJpbmRleCIsInNldFJpbmdPdXRwdXRJbmRpY2VzIiwicmluZ091dHB1dEluZGljZXMiLCJzZXRTdGVhbHRoUHVibGljS2V5Iiwic3RlYWx0aFB1YmxpY0tleSIsImV4cG9ydHMiLCJkZWZhdWx0Il0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHMvd2FsbGV0L21vZGVsL01vbmVyb091dHB1dFF1ZXJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb25lcm9FcnJvciBmcm9tIFwiLi4vLi4vY29tbW9uL01vbmVyb0Vycm9yXCI7XG5pbXBvcnQgTW9uZXJvS2V5SW1hZ2UgZnJvbSBcIi4uLy4uL2RhZW1vbi9tb2RlbC9Nb25lcm9LZXlJbWFnZVwiO1xuaW1wb3J0IE1vbmVyb091dHB1dFdhbGxldCBmcm9tIFwiLi9Nb25lcm9PdXRwdXRXYWxsZXRcIjtcbmltcG9ydCBNb25lcm9UeCBmcm9tIFwiLi4vLi4vZGFlbW9uL21vZGVsL01vbmVyb1R4XCI7XG5pbXBvcnQgTW9uZXJvVHhXYWxsZXQgZnJvbSBcIi4vTW9uZXJvVHhXYWxsZXRcIjtcbmltcG9ydCBNb25lcm9UeFF1ZXJ5IGZyb20gXCIuL01vbmVyb1R4UXVlcnlcIjtcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHRvIHF1ZXJ5IHdhbGxldCBvdXRwdXRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25lcm9PdXRwdXRRdWVyeSBleHRlbmRzIE1vbmVyb091dHB1dFdhbGxldCB7XG5cbiAgbWluQW1vdW50OiBiaWdpbnQ7XG4gIG1heEFtb3VudDogYmlnaW50O1xuICB0eFF1ZXJ5OiBQYXJ0aWFsPE1vbmVyb1R4UXVlcnk+O1xuICBzdWJhZGRyZXNzSW5kaWNlczogbnVtYmVyW107XG5cbiAgLyoqXG4gICAqIDxwPkNvbnN0cnVjdCB0aGUgb3V0cHV0IHF1ZXJ5LjwvcD5cbiAgICogXG4gICAqIDxwPkV4YW1wbGU6PC9wPlxuICAgKiBcbiAgICogPGNvZGU+XG4gICAqICZzb2w7JnNvbDsgZ2V0IGF2YWlsYWJsZSBvdXRwdXRzIGluIGFjY291bnQgMCB3aXRoIGEgbWluaW11bSBhbW91bnQ8YnI+XG4gICAqIGxldCBvdXRwdXRzID0gYXdhaXQgd2FsbGV0LmdldE91dHB1dHMoezxicj5cbiAgICogJm5ic3A7Jm5ic3A7IGlzU3BlbnQ6IGZhbHNlLDxicj5cbiAgICogJm5ic3A7Jm5ic3A7IGlzTG9ja2VkOiBmYWxzZSw8YnI+XG4gICAqICZuYnNwOyZuYnNwOyBhY2NvdW50SW5kZXg6IDAsPGJyPlxuICAgKiAmbmJzcDsmbmJzcDsgbWluQW1vdW50OiBCaWdJbnQoXCI3NTAwMDBcIik8YnI+XG4gICAqIH0pO1xuICAgKiA8L2NvZGU+XG4gICAqIFxuICAgKiA8cD5BbGwgY29uZmlndXJhdGlvbiBpcyBvcHRpb25hbC4gIEFsbCBvdXRwdXRzIGFyZSByZXR1cm5lZCBleGNlcHQgdGhvc2UgdGhhdCBkb24ndCBtZWV0IGNyaXRlcmlhIGRlZmluZWQgaW4gdGhpcyBxdWVyeS48L3A+XG4gICAqIFxuICAgKiBAcGFyYW0ge01vbmVyb091dHB1dFF1ZXJ5fSBbY29uZmlnXSAtIG91dHB1dCBxdWVyeSBjb25maWd1cmF0aW9uIChvcHRpb25hbClcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbmZpZy5hY2NvdW50SW5kZXggLSBnZXQgb3V0cHV0cyBpbiB0aGlzIGFjY291bnQgaW5kZXhcbiAgICogQHBhcmFtIHtudW1iZXJ9IGNvbmZpZy5zdWJhZGRyZXNzSW5kZXggLSBnZXQgb3V0cHV0cyBpbiB0aGlzIHN1YmFkZHJlc3MgaW5kZXhcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gY29uZmlnLnN1YmFkZHJlc3NJbmRpY2VzIC0gZ2V0IG91dHB1dHMgaW4gdGhlc2Ugc3ViYWRkcmVzcyBpbmRpY2VzXG4gICAqIEBwYXJhbSB7YmlnaW50fSBjb25maWcuYW1vdW50IC0gZ2V0IG91dHB1dHMgd2l0aCB0aGlzIGFtb3VudFxuICAgKiBAcGFyYW0ge2JpZ2ludH0gY29uZmlnLm1pbkFtb3VudCAtIGdldCBvdXRwdXRzIHdpdGggYW1vdW50IGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGlzIGFtb3VudFxuICAgKiBAcGFyYW0ge2JpZ2ludH0gY29uZmlnLm1heEFtb3VudCAtIGdldCBvdXRwdXRzIHdpdGggYW1vdW50IGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGlzIGFtb3VudFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZpZy5pc1NwZW50IC0gZ2V0IHNwZW50IHhvciB1bnNwZW50IG91dHB1dHNcbiAgICogQHBhcmFtIHtib29sZWFufSBjb25maWcuaXNGcm96ZW4gLSBnZXQgZnJvemVuIHhvciB0aGF3ZWQgb3V0cHV0c1xuICAgKiBAcGFyYW0ge01vbmVyb0tleUltYWdlfSBjb25maWcua2V5SW1hZ2UgLSBnZXQgb3V0cHV0cyB3aXRoIGEga2V5IGltYWdlIG1hdGNoaW5nIGZpZWxkcyBkZWZpbmVkIGluIHRoaXMga2V5IGltYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcua2V5SW1hZ2UuaGV4IC0gZ2V0IG91dHB1dHMgd2l0aCB0aGlzIGtleSBpbWFnZSBoZXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5rZXlJbWFnZS5zaWduYXR1cmUgLSBnZXQgb3V0cHV0cyB3aXRoIHRoaXMga2V5IGltYWdlIHNpZ25hdHVyZVxuICAgKiBAcGFyYW0ge01vbmVyb1R4UXVlcnl9IGNvbmZpZy50eFF1ZXJ5IC0gZ2V0IG91dHB1dHMgd2hvc2UgdHggbWF0Y2ggdGhpcyB0eCBxdWVyeVxuICAgKi9cbiAgY29uc3RydWN0b3IocXVlcnk/OiBQYXJ0aWFsPE1vbmVyb091dHB1dFF1ZXJ5Pikge1xuICAgIHN1cGVyKHF1ZXJ5KTtcbiAgICBpZiAodGhpcy5taW5BbW91bnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGhpcy5taW5BbW91bnQgIT09IFwiYmlnaW50XCIpIHRoaXMubWluQW1vdW50ID0gQmlnSW50KHRoaXMubWluQW1vdW50KTtcbiAgICBpZiAodGhpcy5tYXhBbW91bnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdGhpcy5tYXhBbW91bnQgIT09IFwiYmlnaW50XCIpIHRoaXMubWF4QW1vdW50ID0gQmlnSW50KHRoaXMubWF4QW1vdW50KTtcbiAgICBpZiAodGhpcy50eFF1ZXJ5ICYmICEodGhpcy50eFF1ZXJ5IGluc3RhbmNlb2YgTW9uZXJvVHhRdWVyeSkpIHRoaXMudHhRdWVyeSA9IG5ldyBNb25lcm9UeFF1ZXJ5KHRoaXMudHhRdWVyeSk7XG4gICAgaWYgKHRoaXMudHhRdWVyeSkgdGhpcy50eFF1ZXJ5LnNldE91dHB1dFF1ZXJ5KHRoaXMpO1xuICAgIGlmICh0aGlzLmlzTG9ja2VkICE9PSB1bmRlZmluZWQpIHRocm93IG5ldyBNb25lcm9FcnJvcihcImlzTG9ja2VkIG11c3QgYmUgcGFydCBvZiB0eCBxdWVyeSwgbm90IG91dHB1dCBxdWVyeVwiKTtcbiAgfVxuICBcbiAgY29weSgpOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgcmV0dXJuIG5ldyBNb25lcm9PdXRwdXRRdWVyeSh0aGlzKTtcbiAgfVxuICBcbiAgdG9Kc29uKCk6IGFueSB7XG4gICAgbGV0IGpzb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLCBzdXBlci50b0pzb24oKSk7XG4gICAgaWYgKHRoaXMuZ2V0TWluQW1vdW50KCkgIT09IHVuZGVmaW5lZCkganNvbi5taW5BbW91bnQgPSB0aGlzLmdldE1pbkFtb3VudCgpLnRvU3RyaW5nKCk7XG4gICAgaWYgKHRoaXMuZ2V0TWF4QW1vdW50KCkgIT09IHVuZGVmaW5lZCkganNvbi5tYXhBbW91bnQgPSB0aGlzLmdldE1heEFtb3VudCgpLnRvU3RyaW5nKCk7XG4gICAgZGVsZXRlIGpzb24udHhRdWVyeTtcbiAgICByZXR1cm4ganNvbjtcbiAgfVxuICBcbiAgZ2V0TWluQW1vdW50KCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMubWluQW1vdW50O1xuICB9XG5cbiAgc2V0TWluQW1vdW50KG1pbkFtb3VudDogYmlnaW50KTogTW9uZXJvT3V0cHV0UXVlcnkge1xuICAgIHRoaXMubWluQW1vdW50ID0gbWluQW1vdW50O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0TWF4QW1vdW50KCk6IGJpZ2ludCB7XG4gICAgcmV0dXJuIHRoaXMubWF4QW1vdW50O1xuICB9XG5cbiAgc2V0TWF4QW1vdW50KG1heEFtb3VudDogYmlnaW50KTogTW9uZXJvT3V0cHV0UXVlcnkge1xuICAgIHRoaXMubWF4QW1vdW50ID0gbWF4QW1vdW50O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBnZXRUeFF1ZXJ5KCk6IE1vbmVyb1R4UXVlcnkge1xuICAgIHJldHVybiB0aGlzLnR4UXVlcnkgYXMgTW9uZXJvVHhRdWVyeTtcbiAgfVxuICBcbiAgc2V0VHhRdWVyeSh0eFF1ZXJ5OiBNb25lcm9UeFF1ZXJ5KTogTW9uZXJvT3V0cHV0UXVlcnkge1xuICAgIHRoaXMudHhRdWVyeSA9IHR4UXVlcnkgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHR4UXVlcnkgaW5zdGFuY2VvZiBNb25lcm9UeFF1ZXJ5ID8gdHhRdWVyeSA6IG5ldyBNb25lcm9UeFF1ZXJ5KHR4UXVlcnkpO1xuICAgIGlmICh0eFF1ZXJ5KSB0aGlzLnR4UXVlcnkub3V0cHV0UXVlcnkgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBnZXRTdWJhZGRyZXNzSW5kaWNlcygpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuc3ViYWRkcmVzc0luZGljZXM7XG4gIH1cbiAgXG4gIHNldFN1YmFkZHJlc3NJbmRpY2VzKHN1YmFkZHJlc3NJbmRpY2VzOiBudW1iZXJbXSk6IE1vbmVyb091dHB1dFF1ZXJ5IHtcbiAgICB0aGlzLnN1YmFkZHJlc3NJbmRpY2VzID0gc3ViYWRkcmVzc0luZGljZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgXG4gIG1lZXRzQ3JpdGVyaWEob3V0cHV0OiBNb25lcm9PdXRwdXRXYWxsZXQsIHF1ZXJ5UGFyZW50ID0gdHJ1ZSk6IGJvb2xlYW4ge1xuICAgIGlmICghKG91dHB1dCBpbnN0YW5jZW9mIE1vbmVyb091dHB1dFdhbGxldCkpIHRocm93IG5ldyBFcnJvcihcIk91dHB1dCBub3QgZ2l2ZW4gdG8gTW9uZXJvT3V0cHV0UXVlcnkubWVldHNDcml0ZXJpYShvdXRwdXQpXCIpO1xuICAgIFxuICAgIC8vIGZpbHRlciBvbiBvdXRwdXRcbiAgICBpZiAodGhpcy5nZXRBY2NvdW50SW5kZXgoKSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZ2V0QWNjb3VudEluZGV4KCkgIT09IG91dHB1dC5nZXRBY2NvdW50SW5kZXgoKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh0aGlzLmdldFN1YmFkZHJlc3NJbmRleCgpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5nZXRTdWJhZGRyZXNzSW5kZXgoKSAhPT0gb3V0cHV0LmdldFN1YmFkZHJlc3NJbmRleCgpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHRoaXMuZ2V0QW1vdW50KCkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldEFtb3VudCgpICE9PSBvdXRwdXQuZ2V0QW1vdW50KCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodGhpcy5nZXRJc1NwZW50KCkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldElzU3BlbnQoKSAhPT0gb3V0cHV0LmdldElzU3BlbnQoKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh0aGlzLmdldElzRnJvemVuKCkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldElzRnJvemVuKCkgIT09IG91dHB1dC5nZXRJc0Zyb3plbigpKSByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgLy8gZmlsdGVyIG9uIG91dHB1dCdzIGtleSBpbWFnZVxuICAgIGlmICh0aGlzLmdldEtleUltYWdlKCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKG91dHB1dC5nZXRLZXlJbWFnZSgpID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmdldEtleUltYWdlKCkuZ2V0SGV4KCkgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldEtleUltYWdlKCkuZ2V0SGV4KCkgIT09IG91dHB1dC5nZXRLZXlJbWFnZSgpLmdldEhleCgpKSByZXR1cm4gZmFsc2U7XG4gICAgICBpZiAodGhpcy5nZXRLZXlJbWFnZSgpLmdldFNpZ25hdHVyZSgpICE9PSB1bmRlZmluZWQgJiYgdGhpcy5nZXRLZXlJbWFnZSgpLmdldFNpZ25hdHVyZSgpICE9PSBvdXRwdXQuZ2V0S2V5SW1hZ2UoKS5nZXRTaWduYXR1cmUoKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICAvLyBmaWx0ZXIgb24gZXh0ZW5zaW9uc1xuICAgIGlmICh0aGlzLmdldFN1YmFkZHJlc3NJbmRpY2VzKCkgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5nZXRTdWJhZGRyZXNzSW5kaWNlcygpLmluY2x1ZGVzKG91dHB1dC5nZXRTdWJhZGRyZXNzSW5kZXgoKSkpIHJldHVybiBmYWxzZTtcbiAgICBcbiAgICAvLyBmaWx0ZXIgd2l0aCB0eCBxdWVyeVxuICAgIGlmICh0aGlzLmdldFR4UXVlcnkoKSAmJiAhdGhpcy5nZXRUeFF1ZXJ5KCkubWVldHNDcml0ZXJpYShvdXRwdXQuZ2V0VHgoKSBhcyBNb25lcm9UeFdhbGxldCwgZmFsc2UpKSByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgLy8gZmlsdGVyIG9uIHJlbWFpbmluZyBmaWVsZHNcbiAgICBpZiAodGhpcy5nZXRNaW5BbW91bnQoKSAhPT0gdW5kZWZpbmVkICYmIChvdXRwdXQuZ2V0QW1vdW50KCkgPT09IHVuZGVmaW5lZCB8fCBvdXRwdXQuZ2V0QW1vdW50KCkgPCB0aGlzLmdldE1pbkFtb3VudCgpKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh0aGlzLmdldE1heEFtb3VudCgpICE9PSB1bmRlZmluZWQgJiYgKG91dHB1dC5nZXRBbW91bnQoKSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dC5nZXRBbW91bnQoKSA+IHRoaXMuZ2V0TWF4QW1vdW50KCkpKSByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgLy8gb3V0cHV0IG1lZXRzIHF1ZXJ5XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLSBPVkVSUklERSBDT1ZBUklBTlQgUkVUVVJOIFRZUEVTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNldFR4KHR4OiBNb25lcm9UeCk6IE1vbmVyb091dHB1dFF1ZXJ5IHtcbiAgICBzdXBlci5zZXRUeCh0eCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRBY2NvdW50SW5kZXgoYWNjb3VudEluZGV4OiBudW1iZXIpOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0QWNjb3VudEluZGV4KGFjY291bnRJbmRleCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRTdWJhZGRyZXNzSW5kZXgoc3ViYWRkcmVzc0luZGV4OiBudW1iZXIpOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0U3ViYWRkcmVzc0luZGV4KHN1YmFkZHJlc3NJbmRleCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRJc1NwZW50KGlzU3BlbnQ6IGJvb2xlYW4pOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0SXNTcGVudChpc1NwZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBcbiAgc2V0SXNGcm96ZW4oaXNGcm96ZW46IGJvb2xlYW4pOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0SXNGcm96ZW4oaXNGcm96ZW4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFxuICBzZXRLZXlJbWFnZShrZXlJbWFnZTogTW9uZXJvS2V5SW1hZ2UpOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0S2V5SW1hZ2Uoa2V5SW1hZ2UpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0QW1vdW50KGFtb3VudDogYmlnaW50KTogTW9uZXJvT3V0cHV0UXVlcnkge1xuICAgIHN1cGVyLnNldEFtb3VudChhbW91bnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0SW5kZXgoaW5kZXg6IG51bWJlcik6IE1vbmVyb091dHB1dFF1ZXJ5IHtcbiAgICBzdXBlci5zZXRJbmRleChpbmRleCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRSaW5nT3V0cHV0SW5kaWNlcyhyaW5nT3V0cHV0SW5kaWNlczogbnVtYmVyW10pOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0UmluZ091dHB1dEluZGljZXMocmluZ091dHB1dEluZGljZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0U3RlYWx0aFB1YmxpY0tleShzdGVhbHRoUHVibGljS2V5OiBzdHJpbmcpOiBNb25lcm9PdXRwdXRRdWVyeSB7XG4gICAgc3VwZXIuc2V0U3RlYWx0aFB1YmxpY0tleShzdGVhbHRoUHVibGljS2V5KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoieUxBQUEsSUFBQUEsWUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBOztBQUVBLElBQUFDLG1CQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7OztBQUdBLElBQUFFLGNBQUEsR0FBQUgsc0JBQUEsQ0FBQUMsT0FBQTs7QUFFQTtBQUNBO0FBQ0E7QUFDZSxNQUFNRyxpQkFBaUIsU0FBU0MsMkJBQWtCLENBQUM7Ozs7Ozs7RUFPaEU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDRUMsV0FBV0EsQ0FBQ0MsS0FBa0MsRUFBRTtJQUM5QyxLQUFLLENBQUNBLEtBQUssQ0FBQztJQUNaLElBQUksSUFBSSxDQUFDQyxTQUFTLEtBQUtDLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FBQ0QsU0FBUyxLQUFL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