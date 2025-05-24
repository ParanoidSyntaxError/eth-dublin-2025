// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit, IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import {IERC20Clone} from "./IERC20Clone.sol";

contract ERC20Clone is
    ERC20,
    Ownable,
    ERC1363,
    ERC20Permit,
    Initializable,
    IERC20Clone
{
    string private _name;
    string private _symbol;

    constructor() ERC20("", "") Ownable(address(1)) ERC20Permit("") {}

    function initialize(
        address owner,
        string memory tokenName,
        string memory tokenSymbol
    ) external override initializer {
        _transferOwnership(owner);

        _name = tokenName;
        _symbol = tokenSymbol;
    }

    function nonces(
        address owner
    )
        public
        view
        virtual
        override(ERC20Permit, IERC20Permit)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function mint(address to, uint256 amount) external override onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 value) external override {
        _burn(_msgSender(), value);
    }

    function burnFrom(address account, uint256 value) external override {
        _spendAllowance(account, _msgSender(), value);
        _burn(account, value);
    }
}