pragma solidity ^0.4.24;

contract EvidenceProtection
{
    address police;
    address detective;
    address forensic;
    string description;
    uint caseNumber;
    struct Evidence{
        string description;
        uint caseNumber;
        string hash;
		address owner;
		uint timestamp;
    }

	mapping(address=>Evidence)public evidenceOwner;
    mapping(address=>bool)public evidenceOwnerApproval;
    Evidence[] evds;
    address [] players;
    constructor() public
    {
        police=msg.sender;
    }

    function registerDetective() returns (address) {
        players.push(msg.sender);
        return detective;
    }

    function registerForensic() returns (address) {
        players.push(msg.sender);
        return forensic;
    }

    function createEvidence(string _description, uint _caseNumber, string _hash) public
    {
        address evidence_owner = msg.sender;
        Evidence memory proof=Evidence({description:_description, caseNumber:_caseNumber, hash: _hash, owner:evidence_owner, timestamp:now});
        evds.push(proof);
        evidenceOwner[msg.sender]=proof;
    }

    function evidenceCount() view public  returns(uint) {
        return evds.length;
    }

    function getEvidence(uint _idx) view public returns(string, uint, string, address, uint ) {
        Evidence memory evd = evds[_idx];
        return (
            evd.description,
            evd.caseNumber,
            evd.hash,
            evd.owner,
            evd.timestamp
        );
    }

}
