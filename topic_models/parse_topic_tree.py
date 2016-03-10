import collections
import json
import sys

Node = collections.namedtuple("Node", "idx, left, right, terms")


def load_nodes(input_file):
    raw_data = open(input_file).read()
    json_data = json.loads(raw_data)

    json_nodes = json_data['nodes']
    node_list = []
    for node in json_nodes:
        node_list.append(Node(idx=node['id'],
                              left=node['left_child_id'],
                              right=node['right_child_id'],
                              terms=node['top_terms']))

    return node_list


def get_leaves(nodes):
    leaves = []
    process_to_leaves(nodes, nodes[0], leaves)
    process_to_leaves(nodes, nodes[1], leaves)
    return leaves


def process_to_leaves(nodes, current_node, leaves):
    if current_node.left < 0 and current_node.right < 0:
        leaves.append(current_node.idx)
        return leaves

    if current_node.left >= 0:
        process_to_leaves(nodes, nodes[current_node.left], leaves)

    if current_node.right >= 0:
        process_to_leaves(nodes, nodes[current_node.right], leaves)

    return leaves


def get_at_depth(depth, nodes):
    depth_nodes = []
    get_at_depth(depth, 0, nodes, nodes[0], depth_nodes)
    get_at_depth(depth, 0, nodes, nodes[1], depth_nodes)
    return depth_nodes


def process_to_depth(depth, current_depth, nodes, current_node, depth_nodes):
    if ((current_depth == depth) or
       (current_node.left < 0 and current_node.right < 0)):
        depth_nodes.append(current_node.idx)
        return depth_nodes

    if current_node.left >= 0:
        get_at_depth(depth, current_depth + 1,
                     nodes, nodes[current_node.left], depth_nodes)

    if current_node.right >= 0:
        get_at_depth(depth, current_depth + 1,
                     nodes, nodes[current_node.right], depth_nodes)

    return depth_nodes


def write_terms(filename, node_indices, nodes):
    f = open(filename, 'w')

    for node_idx in node_indices:
        idx = nodes[node_idx].idx
        terms = nodes[node_idx].terms
        termsCsv = ",".join(terms)
        f.write(str(idx) + "=" + termsCsv + "\n")


def main(argv):
    nodes = load_nodes(argv[1])

    leaves = get_leaves(nodes)
    print leaves

    write_terms(argv[2], leaves, nodes)


if __name__ == "__main__":
    main(sys.argv)
