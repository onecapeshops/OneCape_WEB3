// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract OneCapeDAONFT is
  Initializable,
  ContextUpgradeable,
  AccessControlEnumerableUpgradeable,
  ERC1155BurnableUpgradeable,
  ERC1155PausableUpgradeable,
  BaseRelayRecipient,
  KeeperCompatibleInterface
{
  bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
  bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

  address public creator;
  uint256 public cost;
  uint256 public maxMintAmount;
  uint256 public maxSupply;
  uint256 public communityEngagementReward;
  uint256 public commEngRewardIncir;
  uint256 public nftsInCirculation;
  uint256 public nextTokenId;
  bool public isMinterPaused;
  string public metaDataURI;
  string[] public dynamicTokenURI;
  uint256 public preSaleCost;
  uint256 public lastTimeStamp;
  uint256 public interval;
  uint256 public day;
  string public name = "";
  string public symbol = "";
  // Merkle rootHash
  bytes32 public root = "";

  function initialize(string memory tokenURI, address _trustForwarderAddress)
    public
    initializer
  {
    __Context_init_unchained();
    __ERC165_init_unchained();
    __AccessControl_init_unchained();
    __AccessControlEnumerable_init_unchained();
    __ERC1155_init_unchained(tokenURI);
    __ERC1155Burnable_init_unchained();
    __Pausable_init_unchained();
    __ERC1155Pausable_init_unchained();
    // Forwarder
    _setTrustedForwarder(_trustForwarderAddress);

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
    _setupRole(BURNER_ROLE, _msgSender());
    _setupRole(URI_SETTER_ROLE, _msgSender());
    _setupRole(UPGRADER_ROLE, _msgSender());

    creator = _msgSender();
    cost = 0.03 ether;
    preSaleCost = 0.01 ether;
    maxMintAmount = 10;
    maxSupply = 1000;
    communityEngagementReward = 100;
    commEngRewardIncir = 100;
    nextTokenId = 1;
    nftsInCirculation = 0;
    isMinterPaused = false;
    name = "OneCape Shop NFT";
    symbol = "OSN";
    lastTimeStamp = block.timestamp;
    interval = 86400;
    day = 1;
    dynamicTokenURI = ["https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/1.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/a.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/c.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/e.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/n.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/o.png", "https://bafybeidmsycbezl6tgupuwdmmqqozk3tsrfjt6eh2bsk7xka7u7r4un2dy.ipfs.nftstorage.link/p.png"];
    metaDataURI = tokenURI;
  }

  struct OneCapeNFT {
    uint256 id;
    address creator;
    address owner;
    uint256 timeOfGenerate;
  }

  mapping(uint256 => OneCapeNFT) nftLogs;

  event Mint(uint256 tokenId, address tokenOwner, OneCapeNFT newNFT);

  // Compliance

  modifier generalMintCompliance(uint256 _mintAmount) {
    require(!isMinterPaused, "The contract is paused!");
    require(
      nftsInCirculation + _mintAmount <=
        (maxSupply - communityEngagementReward),
      "Max supply exceeded!"
    );
    require(msg.value == cost, "Insufficient balance");
    _;
  }

  modifier rewardMintCompliance(uint256 _mintAmount) {
    require(!isMinterPaused, "The contract is paused!");
    require(_mintAmount <= commEngRewardIncir, "Max supply exceeded!");
    _;
  }

  // Merkle verification

  function checkValidity(bytes32[] calldata _merkleProof)
    public
    view
    returns (bool)
  {
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(MerkleProof.verify(_merkleProof, root, leaf), "Incorrect proof");
    return true; // Or you can mint tokens here
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

  // Chainlink keepers

  function checkUpkeep(
    bytes calldata /* checkData */
  )
    external
    view
    override
    returns (
      bool upkeepNeeded,
      bytes memory /* performData */
    )
  {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
  }

  function performUpkeep(
    bytes calldata /* performData */
  ) external override {
    //We highly recommend revalidating the upkeep in the performUpkeep function
    if ((block.timestamp - lastTimeStamp) > interval) {
      lastTimeStamp = block.timestamp;
      if (day == 7) {
        day = 1;
        _setURI(dynamicTokenURI[0]);
      } else {
        _setURI(dynamicTokenURI[day]);
        day++;
      }
    }
    // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
  }

  // creator exist check

  function _exists(uint256 id) internal view virtual returns (bool) {
    return nftLogs[id].creator != address(0);
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

  function setPauserRole(address _user) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "Only admin can set minter role"
    );
    _setupRole(PAUSER_ROLE, _user);
  }

  function setBurnerRole(address _user) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "Only admin can set minter role"
    );
    _setupRole(BURNER_ROLE, _user);
  }

  // Mint Methods

  function mint(uint256 mintAmount)
    public
    payable
    virtual
    generalMintCompliance(mintAmount)
  {
    for (uint256 i = 0; i < mintAmount; i++) {
      OneCapeNFT memory newNft = OneCapeNFT({
        id: nextTokenId,
        creator: creator,
        owner: msg.sender,
        timeOfGenerate: block.timestamp
      });
      nftLogs[nextTokenId] = newNft;
      nextTokenId++;
      nftsInCirculation++;
      _mint(msg.sender, nextTokenId, 1, "");
      emit Mint(nextTokenId, msg.sender, newNft);
    }
  }

  function WhitelistMint(uint256 mintAmount, bytes32[] calldata _merkleProof)
    public
    payable
    virtual
    generalMintCompliance(mintAmount)
  {
    require(checkValidity(_merkleProof), "User not in the whitelist");
    for (uint256 i = 0; i < mintAmount; i++) {
      OneCapeNFT memory newNft = OneCapeNFT({
        id: nextTokenId,
        creator: creator,
        owner: msg.sender,
        timeOfGenerate: block.timestamp
      });
      nftLogs[nextTokenId] = newNft;
      nextTokenId++;
      nftsInCirculation++;
      commEngRewardIncir--;
      _mint(msg.sender, nextTokenId, 1, "");
      emit Mint(nextTokenId, msg.sender, newNft);
    }
  }

  function communityEngagementRewardMint(uint256 mintAmount, address _address)
    public
    payable
    virtual
    rewardMintCompliance(mintAmount)
  {
    for (uint256 i = 0; i < mintAmount; i++) {
      OneCapeNFT memory newNft = OneCapeNFT({
        id: nextTokenId,
        creator: creator,
        owner: _address,
        timeOfGenerate: block.timestamp
      });
      nftLogs[nextTokenId] = newNft;
      nextTokenId++;
      nftsInCirculation++;
      _mint(_address, nextTokenId, 1, "");
      emit Mint(nextTokenId, _address, newNft);
    }
  }

  function mintBatch(uint256[] memory ids, uint256[] memory amounts)
    public
    payable
    virtual
    generalMintCompliance(ids.length)
  {
    _mintBatch(msg.sender, ids, amounts, "");

    for (uint256 i = 0; i < ids.length; i++) {
      OneCapeNFT memory newNft = OneCapeNFT({
        id: ids[i],
        creator: creator,
        owner: msg.sender,
        timeOfGenerate: block.timestamp
      });
      nftLogs[ids[i]] = newNft;
      nextTokenId++;
      nftsInCirculation++;
      emit Mint(ids[i], msg.sender, newNft);
    }
  }

  // Write Functions

  function setMerkleRootNode(bytes32 _merkleRootNode) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "Only admin can set merkle root node"
    );
    root = _merkleRootNode;
  }

  function setUri(string memory _uri) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "ERC1155PresetMinterPauser: must have minter role to token uri"
    );
    _setURI(_uri);
  }

  function setDynamicTokenURI(string[] memory _uri) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "ERC1155PresetMinterPauser: must have minter role to set dynamic token uri"
    );
    dynamicTokenURI = _uri;
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
      "OneCapeNFT: must have admin role to change"
    );
    maxSupply = supply;
  }

  function setMintCost(uint256 mintCost) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "OneCapeNFT: must have admin role to change"
    );
    cost = mintCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "OneCapeNFT: must have admin role to change"
    );
    maxMintAmount = _newmaxMintAmount;
  }

  function setPresaleCost(uint256 _newCost) public virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "OneCapeNFT: must have admin role to change"
    );
    preSaleCost = _newCost;
  }

  // Withdraw contract funds

  function withdraw() external payable virtual {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
      "ERC1155PresetMinterPauser: must have ADMIN role to withdraw"
    );
    // This will transfer the remaining contract balance to the owner (contractOwner address).
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = msg.sender.call{ value: address(this).balance }("");
    require(os);
    // =============================================================================
  }

  // Read Functions

  // func to get tokenURI
  function uri(uint256 _id) public view override returns (string memory) {
    return uri(_id);
  }

  // Check dynamic token URIs
  function getDynamicURI(uint256 _day) public view returns (string memory) {
    return dynamicTokenURI[_day];
  }

  // get all dynamic token URIs
  function getAllDynamicURI() public view returns (string[] memory) {
    return dynamicTokenURI;
  }

  // func to get tokens in circulation
  function getTokenCirculations() public view returns (uint256) {
    return nftsInCirculation;
  }

  function getOneCapeNFT(uint256 id) external view returns (OneCapeNFT memory) {
    return nftLogs[id];
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

  function getPauserRole(address _user) public view virtual returns (bool) {
    return hasRole(PAUSER_ROLE, _user);
  }

  function getAdminRole(address _user) public view virtual returns (bool) {
    return hasRole(DEFAULT_ADMIN_ROLE, _user);
  }

  // Token Burn

  function burn(uint256 _id, uint256 _amount) external {
    require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
    _burn(msg.sender, _id, _amount);
  }

  function burnBatch(uint256[] memory _ids, uint256[] memory _amounts)
    external
  {
    require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
    _burnBatch(msg.sender, _ids, _amounts);
  }

  function burnForMint(
    address _from,
    uint256[] memory _burnIds,
    uint256[] memory _burnAmounts,
    uint256[] memory _mintIds,
    uint256[] memory _mintAmounts
  ) external virtual {
    require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
    _burnBatch(_from, _burnIds, _burnAmounts);
    _mintBatch(_from, _mintIds, _mintAmounts, "");
  }

  // Safe transfer override

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public virtual override {
    require(to != address(0), "ERC1155: transfer to the zero address");
    require(
      from == _msgSender() || isApprovedForAll(from, _msgSender()),
      "ERC1155: caller is not owner, token holder, or pod manager"
    );
    super._safeTransferFrom(from, to, id, amount, data);
    nftLogs[id].owner = to;
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
  ) internal virtual override(ERC1155Upgradeable, ERC1155PausableUpgradeable) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  uint256[50] private __gap;
}
