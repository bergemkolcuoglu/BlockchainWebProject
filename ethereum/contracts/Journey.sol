pragma solidity ^0.4.17;

contract JourneyFactory {
    address[] public deployedJourneys;

    function createJourney(uint minimum, string fromsW, string toW, string atW) public {
        address newJourney = new Journey(minimum, fromsW, toW, atW, msg.sender);
        deployedJourneys.push(newJourney);
    }

    function getDeployedJourneys() public view returns (address[]) {
        return deployedJourneys;
    }

}

contract Journey {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;

    }

    Request[] public requests;
    address public driver;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    string public froms;
    string public to;
    string public time;


    modifier restricted() {
        require(msg.sender == driver);
        _;
    }

    function Journey(uint minimum, string fromsW, string toW, string atW,  address creator) public {
        driver = creator;
        minimumContribution = minimum;
        froms = fromsW;
        to = toW;
        time = atW;

    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient)
    public restricted {
        require(approvers[msg.sender]);
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!requests[index].complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address, string, string, string
      ){
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          driver,
          froms,
          to,
          time
        );
    }

    function getRequestsCount() public view returns (uint) {
      return requests.length;
    }
}
