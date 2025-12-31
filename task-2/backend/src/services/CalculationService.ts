import CalculationNodeRepository from '../repositories/CalculationNodeRepository';
import CalculationNode from '../models/CalculationNode';
import { CalculationNodeDTO, CalculationTreeDTO } from '../types/dtos';
import { OperationType } from '../types/entities';

/**
 * Calculation Service
 * Handles business logic for calculation operations
 */
class CalculationService {
  /**
   * Start a new calculation
   */
  async startCalculation(userId: string, initialValue: number): Promise<CalculationNodeDTO> {
    // Validate input
    if (typeof initialValue !== 'number') {
      throw new Error('Initial value must be a number');
    }

    // Create root node with null root_id initially
    const tempNode = await CalculationNodeRepository.create({
      rootId: null as any, // Will be updated to self-reference
      parentId: null,
      operation: CalculationNode.OPERATIONS.START,
      inputValue: initialValue,
      calculatedValue: initialValue,
      userId,
    });

    // Update root_id to point to itself
    await CalculationNodeRepository.updateRootId(tempNode.id, tempNode.id);

    // Fetch the updated node
    const rootNode = await CalculationNodeRepository.findById(tempNode.id);
    if (!rootNode) {
      throw new Error('Failed to create root node');
    }

    return rootNode.toJSON();
  }

  /**
   * Add an operation to the calculation tree
   */
  async addOperation(
    parentId: string,
    operation: OperationType,
    inputValue: number,
    userId: string
  ): Promise<CalculationNodeDTO> {
    // Validate operation and input
    const errors = CalculationNode.validate({ operation, inputValue });
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    // Get parent node
    const parentNode = await CalculationNodeRepository.findById(parentId);
    if (!parentNode) {
      throw new Error('Parent node not found');
    }

    // Calculate new value
    const calculatedValue = this.calculateValue(
      parentNode.calculatedValue,
      operation,
      inputValue
    );

    // Create new node
    const newNode = await CalculationNodeRepository.create({
      rootId: parentNode.rootId,
      parentId: parentNode.id,
      operation,
      inputValue,
      calculatedValue,
      userId,
    });

    return newNode.toJSON();
  }

  /**
   * Get entire calculation tree
   */
  async getCalculationTree(rootId: string): Promise<CalculationTreeDTO> {
    const nodes = await CalculationNodeRepository.findByRootId(rootId);
    
    if (nodes.length === 0) {
      throw new Error('Calculation not found');
    }

    // Build tree structure
    const nodesMap: { [key: string]: CalculationNodeDTO } = {};
    nodes.forEach(node => {
      nodesMap[node.id] = {
        ...node.toJSON(),
        children: [],
      };
    });

    // Link children to parents
    let rootNode: CalculationTreeDTO | null = null;
    nodes.forEach(node => {
      if (node.parentId === null) {
        rootNode = nodesMap[node.id];
      } else if (nodesMap[node.parentId]) {
        if (!nodesMap[node.parentId].children) {
          nodesMap[node.parentId].children = [];
        }
        nodesMap[node.parentId].children!.push(nodesMap[node.id]);
      }
    });

    if (!rootNode) {
      throw new Error('Root node not found');
    }

    return rootNode;
  }

  /**
   * Get all calculations by user
   */
  async getUserCalculations(userId: string): Promise<CalculationNodeDTO[]> {
    const rootNodes = await CalculationNodeRepository.findByUserId(userId);
    return rootNodes.map(node => node.toJSON());
  }

  /**
   * Delete a calculation tree
   */
  async deleteCalculation(rootId: string, userId: string): Promise<boolean> {
    const rootNode = await CalculationNodeRepository.findById(rootId);
    
    if (!rootNode) {
      throw new Error('Calculation not found');
    }

    // Check if user owns this calculation
    if (rootNode.userId !== userId) {
      throw new Error('Unauthorized to delete this calculation');
    }

    return await CalculationNodeRepository.deleteTree(rootId);
  }

  /**
   * Get all calculations with user data (public endpoint)
   */
  async getAllCalculations(): Promise<any[]> {
    const rootNodes = await CalculationNodeRepository.findAllRootNodesWithUsers();
    
    // Build tree structure for each root node
    const trees = await Promise.all(
      rootNodes.map(async (rootNode) => {
        const allNodes = await CalculationNodeRepository.findByRootIdWithUsers(rootNode.id);
        return this.buildTreeWithUsers(allNodes);
      })
    );

    return trees;
  }

  /**
   * Get calculation tree with user data
   */
  async getCalculationTreeWithUsers(rootId: string): Promise<any> {
    const nodes = await CalculationNodeRepository.findByRootIdWithUsers(rootId);
    
    if (nodes.length === 0) {
      throw new Error('Calculation not found');
    }

    return this.buildTreeWithUsers(nodes);
  }

  /**
   * Build tree structure with user data (frontend-compatible format)
   */
  private buildTreeWithUsers(nodes: any[]): any {
    const nodesMap: { [key: string]: any } = {};
    
    nodes.forEach(node => {
      nodesMap[node.id] = {
        id: node.id,
        author: node.user.username,
        avatarUrl: node.user.avatar_url,
        createdAt: node.created_at.toISOString(),
        operation: node.operation,
        inputValue: node.input_value,
        calculatedValue: node.calculated_value,
        children: [],
      };
    });

    // Link children to parents
    let rootNode: any = null;
    nodes.forEach(node => {
      if (node.parent_id === null) {
        rootNode = nodesMap[node.id];
      } else if (nodesMap[node.parent_id]) {
        nodesMap[node.parent_id].children.push(nodesMap[node.id]);
      }
    });

    return rootNode;
  }

  /**
   * Perform mathematical calculation
   */
  calculateValue(currentValue: number, operation: OperationType, inputValue: number): number {
    switch (operation) {
      case CalculationNode.OPERATIONS.ADD:
        return currentValue + inputValue;
      case CalculationNode.OPERATIONS.SUB:
        return currentValue - inputValue;
      case CalculationNode.OPERATIONS.MUL:
        return currentValue * inputValue;
      case CalculationNode.OPERATIONS.DIV:
        if (inputValue === 0) {
          throw new Error('Cannot divide by zero');
        }
        return currentValue / inputValue;
      default:
        throw new Error('Invalid operation');
    }
  }
}

export default new CalculationService();
