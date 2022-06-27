// SPDX-License-Identifier: MIT LICENSE

pragma solidity 0.8.4;

// import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// 0x911F8342038865BC4080ab5715f32dEF5289e90E

contract RentingNFT is ReentrancyGuard {
    uint256[] public _openRentedNFTsList;
    uint256 public rentNFTNonce;
    address public OneCapeERC20TokenContract;
    address public RentalNFTTokenContract;
    address public owner;

    struct RentBook {
        uint256 rentAssetID;
        uint256 id;
        address owner;
        address rentedTo;
        uint256 amount;
        uint256 createdTimestamp;
        uint256 deadline;
        uint256 noOfDays;
        bool isClosed;
        bool isRentPayed;
    }

    event RentNFTEvent(
        uint256 rentAssetID,
        uint256 tokenID,
        address owner,
        uint256 amount,
        uint256 createdTimestamp,
        uint256 deadline,
        uint256 noOfDays
    );

    event withdrawRentedNFTEvent(
        uint256 tokenID,
        uint256 rentAssetID,
        uint256 createdTimestamp
    );
    event getNFTAsRentEvent(
        uint256 tokenID,
        uint256 rentAssetID,
        address rentedTo,
        uint256 currentTimeStamp,
        uint256 deadlineDate
    );

    mapping(uint256 => RentBook) public rentedNFTsList;

    constructor(address _capeToken, address _rentalNFTContract) {
        rentNFTNonce = 1;
        OneCapeERC20TokenContract = _capeToken;
        RentalNFTTokenContract = _rentalNFTContract;
        owner = msg.sender;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getOpenRentedNFTsListings()
        public
        view
        virtual
        returns (uint256[] memory)
    {
        return _openRentedNFTsList;
    }

    function setERC20TokenContract(address _address) public virtual {
        require(
            owner == msg.sender,
            "ERC1155PresetMinterPauser: must have Admin role to execute"
        );
        OneCapeERC20TokenContract = _address;
    }

    function setRentalNFTTokenContract(address _address) public virtual {
        require(
            owner == msg.sender,
            "ERC1155PresetMinterPauser: must have Admin role to execute"
        );
        RentalNFTTokenContract = _address;
    }

    function RentAsset(
        uint256 _tokenid,
        uint256 _amount,
        uint256 _noOfDays
    ) public virtual nonReentrant {
        bytes memory data = "";
        require(
            IERC1155(RentalNFTTokenContract).balanceOf(msg.sender, _tokenid) >=
                1,
            "ERC1155 token balance is not sufficient for the seller.."
        );

        // require(
        //     nftLogs[_tokenid].isRented != true,
        //     "NFT Already in rent list"
        // );
        // require(nftLogs[_tokenid].forSale != true, "NFTs for Sale cannot be listed");

        require(_amount > 0, "Amount should be not less than zero");

        require(_noOfDays > 0, "Amount should be not less than zero");

        // uint256 deadlineDate = block.timestamp + (_noOfDays * 1 days);

        RentBook memory rent = RentBook({
            rentAssetID: rentNFTNonce,
            id: _tokenid,
            owner: payable(msg.sender),
            rentedTo: address(0),
            amount: _amount,
            createdTimestamp: block.timestamp,
            deadline: 0,
            noOfDays: _noOfDays,
            isClosed: false,
            isRentPayed: false
        });

        rentedNFTsList[rentNFTNonce] = rent;

        _openRentedNFTsList.push(rentNFTNonce);

        rentNFTNonce += 1;

        ERC1155(RentalNFTTokenContract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenid,
            1,
            data
        );

        emit RentNFTEvent(
            rentNFTNonce,
            _tokenid,
            msg.sender,
            _amount,
            block.timestamp,
            0,
            _noOfDays
        );
    }

    function WithdrawRentedAsset(uint256 _tokenid, uint256 _rentedNFTId)
        public
        virtual
        nonReentrant
    {
        bytes memory data = "";

        // require(
        //     nftLogs[_tokenid].isRented != true,
        //     "NFT not in rent mode"
        // );
        require(
            rentedNFTsList[_rentedNFTId].owner == msg.sender,
            "NoT the OWNER"
        );

        if (
            (rentedNFTsList[_rentedNFTId].isRentPayed == true) &&
            (block.timestamp > rentedNFTsList[_rentedNFTId].deadline)
        ) {
            // nftLogs[_tokenid].isRented = false;
            rentedNFTsList[_rentedNFTId].isClosed = true;
            _toRemoveRentedNFTsList(_rentedNFTId);

            IERC20(OneCapeERC20TokenContract).transferFrom(
                address(this),
                msg.sender,
                rentedNFTsList[_rentedNFTId].amount
            );

            ERC1155(RentalNFTTokenContract).safeTransferFrom(
                address(this),
                msg.sender,
                _tokenid,
                1,
                data
            );
        } else if (rentedNFTsList[_rentedNFTId].rentedTo == address(0)) {
            rentedNFTsList[_rentedNFTId].isClosed = true;
            _toRemoveRentedNFTsList(_rentedNFTId);
            ERC1155(RentalNFTTokenContract).safeTransferFrom(
                address(this),
                msg.sender,
                _tokenid,
                1,
                data
            );
        }

        emit withdrawRentedNFTEvent(_tokenid, _rentedNFTId, block.timestamp);
    }

    function getNFTAsRent(uint256 _tokenid, uint256 _rentedNFTId)
        public
        payable
        virtual
        nonReentrant
    {
        // bytes memory data = "";

        // require(
        //     nftLogs[_tokenid].isRented != true,
        //     "NFT Not in rent mode"
        // );
        require(
            rentedNFTsList[_rentedNFTId].rentedTo == address(0),
            "Already someone rented"
        );

        uint256 balanceToken = 0;
        balanceToken = IERC20(OneCapeERC20TokenContract).balanceOf(msg.sender);
        require(
            balanceToken >= rentedNFTsList[_rentedNFTId].amount,
            "not enough balance to cover item price and market fee"
        );

        // require(msg.value == rentedNFTsList[_rentedNFTId].amount, "Mismatch in rent amount");

        uint256 deadlineDate = block.timestamp +
            (rentedNFTsList[_rentedNFTId].noOfDays * 1 days);

        IERC20(OneCapeERC20TokenContract).transferFrom(
            msg.sender,
            address(this),
            rentedNFTsList[_rentedNFTId].amount
        );

        // nftLogs[_tokenid].isRented = true;
        rentedNFTsList[_rentedNFTId].isRentPayed = true;
        rentedNFTsList[_rentedNFTId].rentedTo = msg.sender;
        rentedNFTsList[_rentedNFTId].deadline = deadlineDate;
        _toRemoveRentedNFTsList(_rentedNFTId);

        emit getNFTAsRentEvent(
            _tokenid,
            _rentedNFTId,
            msg.sender,
            block.timestamp,
            deadlineDate
        );
    }

    function _toRemoveRentedNFTsList(uint256 _rentedNFTId) internal {
        for (uint256 x = 0; x < _openRentedNFTsList.length; x++) {
            if (
                keccak256(abi.encodePacked(_openRentedNFTsList[x])) ==
                keccak256(abi.encodePacked(_rentedNFTId))
            ) {
                for (uint256 i = x; i < _openRentedNFTsList.length - 1; i++) {
                    _openRentedNFTsList[i] = _openRentedNFTsList[i + 1];
                }
                _openRentedNFTsList.pop();
            }
        }
    }

    function withdraw() external payable virtual {
        require(
            owner == msg.sender,
            "ERC1155PresetMinterPauser: must have ADMIN role to withdraw"
        );
        // This will transfer the remaining contract balance to the owner (contractOwner address).
        // Do not remove this otherwise you will not be able to withdraw the funds.
        // =============================================================================
        (bool os, ) = msg.sender.call{value: address(this).balance}("");
        require(os);
        // =============================================================================
    }
}
