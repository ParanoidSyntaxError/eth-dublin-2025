// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

import {ERC20Clone, IERC20Clone} from "./token/ERC20Clone.sol";
import {IHackFund} from "./IHackFund.sol";

contract HackFund is IHackFund, ReentrancyGuard {
    using SafeERC20 for IERC20Clone;

    uint256 public constant PRICE_SCALE = 1e18;

    uint256 public constant TOKEN_MAX_SUPPLY = 1_000_000_000 * 1e18;

    address public immutable tokenImplementation;

    mapping(address => Hack) private _hacks;

    constructor() {
        tokenImplementation = address(new ERC20Clone());
    }

    function newHack(
        string memory name,
        string memory symbol,
        Hack memory hackParams,
        uint256 mintAmount,
        address mintReceiver,
        bytes32 salt
    ) external override returns (address) {
        if (hackParams.expiration <= block.timestamp) {
            revert FundingExpired(hackParams.expiration, block.timestamp);
        }
        if (hackParams.price == 0) {
            revert ZeroPrice();
        }
        if (mintAmount > TOKEN_MAX_SUPPLY) {
            revert MaxSupplyExceeded(TOKEN_MAX_SUPPLY, mintAmount);
        }

        address token = Clones.cloneDeterministic(tokenImplementation, salt);
        _hacks[token] = hackParams;

        IERC20Clone(token).initialize(address(this), name, symbol);

        if (mintAmount > 0) {
            IERC20Clone(token).mint(mintReceiver, mintAmount);
        }

        emit NewToken(token, name, symbol, mintAmount);
        emit NewHack(token, hackParams.price, hackParams.expiration, hackParams.receiver, hackParams.metadataUri);

        return token;
    }

    function mint(
        address token,
        address to
    ) external payable override nonReentrant {
        Hack memory hack = _hacks[token];

        if (hack.expiration <= block.timestamp) {
            revert FundingExpired(hack.expiration, block.timestamp);
        }

        uint256 amount = _amount(hack.price, msg.value);
        if (amount == 0) {
            revert ZeroMint();
        }

        uint256 newSupply = ERC20Clone(token).totalSupply() + amount;
        if (newSupply > TOKEN_MAX_SUPPLY) {
            revert MaxSupplyExceeded(TOKEN_MAX_SUPPLY, newSupply);
        }

        IERC20Clone(token).mint(to, amount);

        if (newSupply == TOKEN_MAX_SUPPLY) {
            _hacks[token].expiration = 0;

            Address.sendValue(
                payable(hack.receiver),
                _cost(hack.price, TOKEN_MAX_SUPPLY)
            );

            emit Funded(token);
        }

        emit Mint(token, to, amount);
    }

    function refund(
        address token,
        uint256 amount,
        address receiver
    ) external override nonReentrant {
        Hack memory hack = _hacks[token];

        if (hack.expiration == 0) {
            revert FundingComplete();
        }
        if (hack.expiration > block.timestamp) {
            revert FundingOngoing(hack.expiration, block.timestamp);
        }

        IERC20Clone(token).burnFrom(msg.sender, amount);

        Address.sendValue(payable(receiver), _cost(hack.price, amount));
    }

    function predictTokenAddress(
        bytes32 salt
    ) external view override returns (address) {
        return Clones.predictDeterministicAddress(tokenImplementation, salt);
    }

    function getHack(
        address token
    ) external view override returns (Hack memory) {
        return _hacks[token];
    }

    function _amount(
        uint256 price,
        uint256 value
    ) internal pure returns (uint256) {
        return (value * PRICE_SCALE) / price;
    }

    function _cost(
        uint256 price,
        uint256 amount
    ) internal pure returns (uint256) {
        return (price * amount) / PRICE_SCALE;
    }
}
