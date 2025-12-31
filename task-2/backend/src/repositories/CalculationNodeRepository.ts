import { prisma } from '../data/prisma';
import CalculationNode from '../models/CalculationNode';
import { CalculationNode as PrismaCalculationNode } from '@prisma/client';
import { OperationType } from '../types/entities';

/**
 * CalculationNode Repository
 * Handles all database operations for calculation nodes using Prisma
 */
class CalculationNodeRepository {
  /**
   * Create a new calculation node
   */
  async create(nodeData: {
    rootId: string | null;
    parentId: string | null;
    operation: OperationType;
    inputValue: number;
    calculatedValue: number;
    userId: string;
  }): Promise<CalculationNode> {
    const data: any = {
      operation: nodeData.operation,
      input_value: nodeData.inputValue,
      calculated_value: nodeData.calculatedValue,
      user: {
        connect: { id: nodeData.userId }
      },
    };

    // Only include parent relation if parentId is provided
    if (nodeData.parentId) {
      data.parent = { connect: { id: nodeData.parentId } };
    }

    // Only include root relation if rootId is provided
    if (nodeData.rootId) {
      data.root = { connect: { id: nodeData.rootId } };
    }

    const node = await prisma.calculationNode.create({ data });

    return new CalculationNode(this.mapPrismaNode(node));
  }

  /**
   * Find node by ID
   */
  async findById(id: string): Promise<CalculationNode | null> {
    const node = await prisma.calculationNode.findUnique({
      where: { id },
    });

    if (!node) {
      return null;
    }

    return new CalculationNode(this.mapPrismaNode(node));
  }

  /**
   * Find all nodes in a calculation tree
   */
  async findByRootId(rootId: string): Promise<CalculationNode[]> {
    const nodes = await prisma.calculationNode.findMany({
      where: { root_id: rootId },
      orderBy: { created_at: 'asc' },
    });

    return nodes.map(node => new CalculationNode(this.mapPrismaNode(node)));
  }

  /**
   * Find child nodes of a parent
   */
  async findChildren(parentId: string): Promise<CalculationNode[]> {
    const nodes = await prisma.calculationNode.findMany({
      where: { parent_id: parentId },
      orderBy: { created_at: 'asc' },
    });

    return nodes.map(node => new CalculationNode(this.mapPrismaNode(node)));
  }

  /**
   * Find all calculations by user (root nodes only)
   */
  async findByUserId(userId: string): Promise<CalculationNode[]> {
    const nodes = await prisma.calculationNode.findMany({
      where: {
        user_id: userId,
        parent_id: null,
      },
      orderBy: { created_at: 'desc' },
    });

    return nodes.map(node => new CalculationNode(this.mapPrismaNode(node)));
  }

  /**
   * Delete a node (cascades to children)
   */
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.calculationNode.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete entire calculation tree
   */
  async deleteTree(rootId: string): Promise<boolean> {
    try {
      await prisma.calculationNode.deleteMany({
        where: { root_id: rootId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update root_id for a node (used when creating root node)
   */
  async updateRootId(id: string, rootId: string): Promise<void> {
    await prisma.calculationNode.update({
      where: { id },
      data: { root_id: rootId },
    });
  }

  /**
   * Find all root nodes with user data (for public view)
   */
  async findAllRootNodesWithUsers(): Promise<any[]> {
    const nodes = await prisma.calculationNode.findMany({
      where: { parent_id: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return nodes;
  }

  /**
   * Find calculation tree with user data
   */
  async findByRootIdWithUsers(rootId: string): Promise<any[]> {
    const nodes = await prisma.calculationNode.findMany({
      where: { root_id: rootId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });

    return nodes;
  }

  /**
   * Map Prisma CalculationNode to CalculationNodeEntity
   */
  private mapPrismaNode(node: PrismaCalculationNode) {
    return {
      id: node.id,
      root_id: node.root_id,
      parent_id: node.parent_id,
      operation: node.operation as OperationType,
      input_value: node.input_value,
      calculated_value: node.calculated_value,
      user_id: node.user_id,
      created_at: node.created_at,
    };
  }
}

export default new CalculationNodeRepository();
