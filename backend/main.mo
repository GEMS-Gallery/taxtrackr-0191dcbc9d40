import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  // Define the TaxPayer type
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Create a stable variable to store TaxPayer records
  stable var taxPayersEntries : [(Nat, TaxPayer)] = [];
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(10, Nat.equal, Nat.hash);

  // Initialize the taxPayers HashMap with stable data
  taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayersEntries.vals(), 10, Nat.equal, Nat.hash);

  // Create a new TaxPayer record
  public func createTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async () {
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(tid, newTaxPayer);
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer by TID
  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };

  // Pre-upgrade hook to preserve data
  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayers.entries());
  };

  // Post-upgrade hook to restore data
  system func postupgrade() {
    taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayersEntries.vals(), 10, Nat.equal, Nat.hash);
  };
}
