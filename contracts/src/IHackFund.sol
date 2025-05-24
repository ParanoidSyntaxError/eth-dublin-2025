// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IHackFund {
    error ZeroPrice();
    error FundingExpired(uint256 expiration, uint256 timestamp);
    error FundingOngoing(uint256 expiration, uint256 timestamp);
    error FundingComplete();
    error MaxSupplyExceeded(uint256 maxSupply, uint256 newSupply);
    error ZeroMint();

    event NewHack(address indexed token);
    event Funded(address indexed token);
    event Mint(address indexed token, address to, uint256 amount);
    event Refund(address indexed token, address to, uint256 amount);

    struct Hack {
        uint256 price;
        uint256 expiration;
        address receiver;
        string metadataUri;
    }

    function newHack(
        string memory name,
        string memory symbol,
        Hack memory hackParams,
        uint256 mintAmount,
        address mintReceiver
    ) external returns (address token);

    function mint(address token, address to) external payable;

    function refund(address token, uint256 amount, address receiver) external;

    function getHack(address token) external view returns (Hack memory);
}
