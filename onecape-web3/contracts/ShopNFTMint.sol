// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// 0x2680C9F8dB83674C4ff48F5C669408ed33F43A38

contract ShopNFTMint is
    Initializable,
    ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155PausableUpgradeable,
    BaseRelayRecipient,
    ReentrancyGuard
{
    address payable public feeAccount; // the account that receives fees
    uint256 public feePercent;
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    address public creator;
    uint256 public cost;
    uint256 public maxMintAmount;
    uint256 public maxSupply;
    uint256 public nftsInCirculation;
    uint256 public nextTokenId;
    bool public isMinterPaused;
    string public metaDataURI;
    string public name = "";
    string public symbol = "";
    uint256 public listingNonce;
    address public OneCapeERC20TokenContract;
    uint256[] public _openListings;
    address public RentalNFTTokenContract;

    function initialize(address _trustForwarderAddress, address _capeToken)
        public
        initializer
    {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        __ERC1155_init_unchained(
            "https://bafybeibgvrdprufrzkovp4vsegkss5vi4ctjf6bz47ylbwtp5odlkt5y2m.ipfs.nftstorage.link/{id}.json"
        );
        __ERC1155Burnable_init_unchained();
        __Pausable_init_unchained();
        __ERC1155Pausable_init_unchained();
        // Forwarder
        _setTrustedForwarder(_trustForwarderAddress);

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
        _setupRole(URI_SETTER_ROLE, _msgSender());

        feeAccount = payable(address(this));
        feePercent = 5;
        creator = _msgSender();
        cost = 1 ether;
        maxMintAmount = 1;
        maxSupply = 15;
        nextTokenId = 1;
        nftsInCirculation = 0;
        isMinterPaused = false;
        name = "Shop Membership NFT";
        symbol = "SMN";
        metaDataURI = "https://bafybeibgvrdprufrzkovp4vsegkss5vi4ctjf6bz47ylbwtp5odlkt5y2m.ipfs.nftstorage.link/";
        OneCapeERC20TokenContract = _capeToken;
        RentalNFTTokenContract = address(0);
        listingNonce = 1;
    }

    struct NFTDetails {
        uint256 id;
        string tokenURI;
        address creator;
        address owner;
        bool forSale;
        bool isRented;
    }

    struct OrderBook {
        uint256 listingID;
        uint256 id;
        address owner;
        bool forSale;
        uint256 amount;
        uint256 updatedTimestamp;
        bool isClosed;
    }

    mapping(uint256 => NFTDetails) public nftLogs;

    mapping(uint256 => OrderBook) public salesList;

    mapping(uint256 => bool) public _listedTokens;

    event Mint(
        uint256 tokenId,
        string uri,
        address tokenOwner,
        uint256 mintTime,
        bool forSale
    );

    event Transfer(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        uint256 transferTime
    );

    event ListNFT(
        uint256 indexed offeringId,
        uint256 indexed tokenID,
        address owner,
        bool isSale,
        bool isClosed,
        uint256 amount,
        uint256 updatedTimeStamp
    );

    event BoughtNFT(
        uint256 indexed listingId,
        uint256 indexed tokenID,
        address buyer,
        bool isSale,
        bool isClosed,
        uint256 amount,
        uint256 updatedTimeStamp
    );

    event UpdateNFTSalePrice(
        uint256 listingId,
        uint256 tokenID,
        uint256 amount,
        uint256 updatedTimeStamp
    );

    event PutNFTForSale(
        uint256 tokenID,
        uint256 amount,
        uint256 updatedTimeStamp
    );

    event DelistSale(
        uint256 listingId,
        uint256 tokenID,
        uint256 updatedTimeStamp
    );

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

    // Compliance
    modifier mintCompliance() {
        require(!isMinterPaused, "The contract is paused!");
        require(nftsInCirculation + 1 <= maxSupply, "Max supply exceeded!");
        // require(msg.value == cost, "Insufficient balance");
        _;
    }

    modifier marketplaceCompliance(uint256 _amount, uint256 _tokenid) {
        require(
            nftLogs[_tokenid].owner == msg.sender,
            "NFT is not in your wallet"
        );
        require(
            IERC1155(address(this)).balanceOf(msg.sender, _tokenid) >= 1,
            "ERC1155 token balance is not sufficient for the seller.."
        );
        require(
            keccak256(abi.encodePacked(salesList[listingNonce].forSale)) !=
                keccak256(abi.encodePacked(true)),
            "Listing already existed for current tokenID"
        );
        require(_amount > 0, "Amount should be not less than zero");
        _;
    }

    // Gasless transaction
    function _msgSender()
        internal
        view
        override(ContextUpgradeable, BaseRelayRecipient)
        returns (address sender)
    {
        sender = BaseRelayRecipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(ContextUpgradeable, BaseRelayRecipient)
        returns (bytes memory)
    {
        return BaseRelayRecipient._msgData();
    }

    /* Set Trust Forwarder */
    function setTrustForwarder(address _trustedForwarder) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Only admin can set Trust Forwarder"
        );
        _setTrustedForwarder(_trustedForwarder);
    }

    /* Version */
    function versionRecipient() external pure override returns (string memory) {
        return "1";
    }

    // creator exist check
    function _exists(uint256 id) internal view virtual returns (bool) {
        return nftLogs[id].creator != address(0);
    }

    function getOpenListings() public view virtual returns (uint256[] memory) {
        return _openListings;
    }

    function getListedTokenIds(uint256 _id) public view virtual returns (bool) {
        return _listedTokens[_id];
    }

    function setRentalNFTContract(address _rentalContract) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Only admin can set contract"
        );
        RentalNFTTokenContract = _rentalContract;
    }

    // All Write Functions
    // setUpRole
    function setMinterRole(address _user) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Only admin can set minter role"
        );
        _setupRole(MINTER_ROLE, _user);
    }

    function setBurnerRole(address _user) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Only admin can set minter role"
        );
        _setupRole(BURNER_ROLE, _user);
    }

    // Mint Methods
    function mint() public payable virtual mintCompliance {
        uint256 balanceToken = 0;
        balanceToken = IERC20(OneCapeERC20TokenContract).balanceOf(msg.sender);
        require(
            balanceToken >= cost,
            "not enough balance to cover item price and market fee"
        );

        IERC20(OneCapeERC20TokenContract).transferFrom(
            msg.sender,
            creator,
            cost
        );

        NFTDetails memory newNft = NFTDetails({
            id: nextTokenId,
            tokenURI: string(
                abi.encodePacked(
                    metaDataURI,
                    Strings.toString(nextTokenId),
                    ".json"
                )
            ),
            creator: creator,
            owner: msg.sender,
            forSale: false,
            isRented: false
        });
        nftLogs[nextTokenId] = newNft;
        _mint(msg.sender, nextTokenId, 1, "");
        emit Mint(
            nextTokenId,
            string(
                abi.encodePacked(
                    metaDataURI,
                    Strings.toString(nextTokenId),
                    ".json"
                )
            ),
            msg.sender,
            block.timestamp,
            false
        );
        nextTokenId++;
        nftsInCirculation++;
    }

    function listForSale(uint256 _price, uint256 _tokenid)
        public
        virtual
        nonReentrant
    {
        bytes memory data = "";
        // require(_amount > 0, "Amount should be not less than zero");
        require(
            nftLogs[_tokenid].isRented != true,
            "Rented NFTs cannot put for sale"
        );
        require(
            IERC1155(address(this)).balanceOf(msg.sender, _tokenid) >= 1,
            "ERC1155 token balance is not sufficient for the seller.."
        );
        require(
            keccak256(abi.encodePacked(nftLogs[_tokenid].forSale)) !=
                keccak256(abi.encodePacked(true)),
            "Listing already existed for current tokenID"
        );
        require(
            isApprovedForAll(_msgSender(), address(this)),
            "ERC1155: caller is not owner, token holder, or pod manager or no approved"
        );
        // bytes memory data = "";
        uint256 listingId = listingNonce;

        OrderBook memory order = OrderBook({
            listingID: listingId,
            id: _tokenid,
            owner: payable(_msgSender()),
            forSale: true,
            amount: _price,
            updatedTimestamp: block.timestamp,
            isClosed: false
        });
        _openListings.push(listingId);
        listingNonce += 1;
        salesList[listingId] = order;
        nftLogs[_tokenid].forSale = true;
        ERC1155(address(this)).safeTransferFrom(
            _msgSender(),
            address(this),
            _tokenid,
            1,
            data
        );

        emit ListNFT(
            listingId,
            _tokenid,
            _msgSender(),
            true,
            false,
            _price,
            block.timestamp
        );
    }

    // Write Functions
    // marketplace
    function updateSalePrice(
        uint256 _tokenid,
        uint256 _amount,
        uint256 _listingId
    ) public virtual nonReentrant {
        require(
            salesList[_listingId].owner == _msgSender(),
            "NFT is not in your wallet"
        );
        require(nftLogs[_tokenid].forSale == true, "NFT not listed yet");
        require(
            salesList[_listingId].owner == _msgSender(),
            "Only owner can delist from marketplace"
        );
        require(_amount > 0, "Amount should be not less than zero");
        salesList[_listingId].amount = _amount;
        salesList[_listingId].updatedTimestamp = block.timestamp;
        emit UpdateNFTSalePrice(_listingId, _tokenid, _amount, block.timestamp);
    }

    function delistFromMarketplace(uint256 _tokenid, uint256 _listingId)
        public
        virtual
        nonReentrant
    {
        bytes memory data = "";
        require(
            salesList[_listingId].owner != address(0),
            "NFT not listed yet"
        );
        require(
            salesList[_listingId].owner == _msgSender(),
            "Only owner can delist from marketplace"
        );
        require(nftLogs[_tokenid].forSale == true, "NFT is not for sale");

        salesList[_listingId].forSale = false;
        salesList[_listingId].isClosed = true;
        nftLogs[_tokenid].forSale = false;
        salesList[_listingId].updatedTimestamp = block.timestamp;
        _toRemove(_listingId);
        _listedTokens[_tokenid] = false;
        ERC1155(address(this)).safeTransferFrom(
            address(this),
            _msgSender(),
            _tokenid,
            1,
            data
        );
        emit DelistSale(_listingId, _tokenid, block.timestamp);
    }

    function putForSale(
        uint256 _tokenid,
        uint256 _amount,
        uint256 _listingId
    ) public virtual nonReentrant {
        require(
            IERC1155(address(this)).balanceOf(_msgSender(), _tokenid) >= 1,
            "ERC1155 token balance is not sufficient for the seller.."
        );
        require(
            salesList[_listingId].owner != address(0),
            "NFT not listed yet"
        );
        require(nftLogs[_tokenid].forSale != true, "Already listed");
        require(_amount > 0, "Amount should be not less than zero");

        salesList[_listingId].forSale = true;
        salesList[_listingId].amount = _amount;
        salesList[_listingId].isClosed = false;
        nftLogs[_tokenid].forSale = true;
        salesList[_listingId].updatedTimestamp = block.timestamp;
        emit PutNFTForSale(_tokenid, _amount, block.timestamp);
    }

    function purchaseItem(uint256 _listingId) external payable nonReentrant {
        bytes memory data = "";
        OrderBook storage item = salesList[_listingId];
        require(item.owner != address(0), "item doesn't exist");
        require(!item.isClosed, "item already sold");
        require(item.forSale, "item not for sale");
        // pay seller and feeAccount
        uint256 balanceToken = 0;
        balanceToken = IERC20(OneCapeERC20TokenContract).balanceOf(msg.sender);
        require(
            balanceToken >= item.amount,
            "not enough balance to cover item price and market fee"
        );
        IERC20(OneCapeERC20TokenContract).transferFrom(
            msg.sender,
            item.owner,
            item.amount * 1 ether
        );

        // Fee /-
        // IERC20(OneCapeERC20TokenContract).transferFrom(
        //     msg.sender,
        //     address(this),
        //     (_totalPrice - item.amount) * 1 ether
        // );

        // update item to sold
        item.isClosed = true;
        // change for sale prop
        item.forSale = false;

        nftLogs[item.id].forSale = false;
        nftLogs[item.id].owner = msg.sender;
        _toRemove(_listingId);
        _listedTokens[item.id] = false;
        // transfer nft to buyer
        ERC1155(address(this)).safeTransferFrom(
            address(this),
            msg.sender,
            item.id,
            1,
            data
        );
        // emit Bought event
        emit BoughtNFT(
            _listingId,
            item.id,
            msg.sender,
            false,
            true,
            item.amount,
            block.timestamp
        );
    }

    function changeNFTRented(uint256 _tokenid, bool _rented)
        public
        payable
        virtual
        nonReentrant
    {
        require(_msgSender() == nftLogs[_tokenid].owner, "Not an owner");

        if (_rented) {
            nftLogs[_tokenid].isRented = true;
        } else {
            nftLogs[_tokenid].isRented = false;
        }
    }

    function _toRemove(uint256 listingId) internal {
        for (uint256 x = 0; x < _openListings.length; x++) {
            if (
                keccak256(abi.encodePacked(_openListings[x])) ==
                keccak256(abi.encodePacked(listingId))
            ) {
                for (uint256 i = x; i < _openListings.length - 1; i++) {
                    _openListings[i] = _openListings[i + 1];
                }
                _openListings.pop();
            }
        }
    }

    function setERC20TokenContract(address _address) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "ERC1155PresetMinterPauser: must have minter role to execute"
        );
        OneCapeERC20TokenContract = _address;
    }

    // Common write functions
    function setUri(string memory _uri) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "ERC1155PresetMinterPauser: must have minter role to set uri"
        );
        _setURI(_uri);
    }

    function setTokenURIByID(uint256 id, string memory tokenUri)
        public
        virtual
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "NFTDetails: must have admin role to change"
        );
        require(_exists(id), "NFTDetails: URI set of nonexistent token");
        nftLogs[id].tokenURI = tokenUri;
    }

    function pauseMinting(bool _minting) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Must have Admin role to mint"
        );
        isMinterPaused = _minting;
    }

    function setMaxSupply(uint256 supply) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "NFTDetails: must have admin role to change"
        );
        maxSupply = supply;
    }

    function setMintCost(uint256 mintCost) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "NFTDetails: must have admin role to change"
        );
        cost = mintCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "NFTDetails: must have admin role to change"
        );
        maxMintAmount = _newmaxMintAmount;
    }

    // Read Functions
    function getMarketplaceItemsCount() public view returns (uint256) {
        return listingNonce;
    }

    // func to get tokenURI
    function uri(uint256 _id) public view override returns (string memory) {
        return nftLogs[_id].tokenURI;
    }

    // func to get tokens in circulation
    function getTokenCirculations() public view returns (uint256) {
        return nftsInCirculation;
    }

    function getNFTDetails(uint256 id)
        external
        view
        returns (NFTDetails memory)
    {
        return nftLogs[id];
    }

    function getNFTOrderBookDetails(uint256 id)
        external
        view
        returns (OrderBook memory)
    {
        return salesList[id];
    }

    function getNextTokenId() external view returns (uint256) {
        return nextTokenId;
    }

    function getMaxSupply() external view returns (uint256) {
        return maxSupply;
    }

    function getMintCost() external view returns (uint256) {
        return cost;
    }

    function getMinterRole(address _user) public view virtual returns (bool) {
        return hasRole(MINTER_ROLE, _user);
    }

    function getBurnerRole(address _user) public view virtual returns (bool) {
        return hasRole(BURNER_ROLE, _user);
    }

    function getAdminRole(address _user) public view virtual returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _user);
    }

    // Token Burn
    function burn(uint256 _id, uint256 _amount) external {
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(msg.sender, _id, _amount);
    }

    // Safe transfer override
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override // bool fromRentContract
    {
        require(to != address(0), "ERC1155: transfer to the zero address");
        // if(!fromRentContract){
        require(
            from == _msgSender() ||
                isApprovedForAll(from, _msgSender()) ||
                from == RentalNFTTokenContract ||
                RentalNFTTokenContract == _msgSender() ||
                to == RentalNFTTokenContract,
            "ERC1155: caller is not owner, token holder, or pod manager"
        );
        // }
        super._safeTransferFrom(from, to, id, amount, data);
        emit Transfer(from, to, id, amount, block.timestamp);
        nftLogs[id].owner = to;
        if (
            from == RentalNFTTokenContract ||
            RentalNFTTokenContract == _msgSender() ||
            to == RentalNFTTokenContract
        ) {
            nftLogs[id].isRented = true;
        }
        // nftLogs[id].forSale = false;
    }

    // Withdraw contract funds
    function withdraw() external payable virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "ERC1155PresetMinterPauser: must have ADMIN role to withdraw"
        );
        (bool os, ) = msg.sender.call{value: address(this).balance}("");
        require(os);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerableUpgradeable, ERC1155Upgradeable)
        returns (bool)
    {
        if (interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal
        virtual
        override(ERC1155Upgradeable, ERC1155PausableUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    uint256[50] private __gap;
}
