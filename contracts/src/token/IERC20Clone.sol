// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1363} from "@openzeppelin/contracts/interfaces/IERC1363.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

interface IERC20Clone is IERC20, IERC1363, IERC20Permit {
    function initialize(
        address owner,
        string memory tokenName,
        string memory tokenSymbol
    ) external;

    function mint(address account, uint256 value) external;

    function burn(uint256 value) external;
    function burnFrom(address account, uint256 value) external;
}