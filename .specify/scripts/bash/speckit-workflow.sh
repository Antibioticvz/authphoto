#!/usr/bin/env bash
# SpecKit Workflow Orchestrator
# Manages the complete specification workflow from idea to implementation

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source common utilities
source "$SCRIPT_DIR/common.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_msg() {
    local color=$1
    shift
    echo -e "${color}$*${NC}"
}

# Show usage
show_usage() {
    cat << EOF
SpecKit Workflow Orchestrator

Usage: $0 <command> [options]

Commands:
    new <feature-name>          Create a new feature specification
    specify <feature-id>        Run specification phase
    plan <feature-id>           Generate implementation plan
    tasks <feature-id>          Break down into tasks
    analyze <feature-id>        Analyze spec consistency
    checklist <feature-id>      Generate checklist
    implement <feature-id>      Start implementation
    status [feature-id]         Show status of feature(s)
    list                        List all features

Options:
    -h, --help                  Show this help message
    -v, --verbose               Verbose output

Examples:
    $0 new user-authentication
    $0 specify 001-backend-setup
    $0 plan 001-backend-setup
    $0 status 001-backend-setup
    $0 list

EOF
}

# List all features
list_features() {
    print_msg "$BLUE" "📋 Features in specs/"
    echo ""
    
    if [ ! -d "$PROJECT_ROOT/specs" ]; then
        print_msg "$YELLOW" "No specs directory found"
        return
    fi
    
    for spec_dir in "$PROJECT_ROOT/specs"/*/ ; do
        if [ -d "$spec_dir" ]; then
            local feature_id=$(basename "$spec_dir")
            local status="Unknown"
            
            # Determine status based on files present
            if [ -f "$spec_dir/spec.md" ] || [ -f "$spec_dir/plan.md" ]; then
                if [ -f "$spec_dir/tasks.md" ]; then
                    if [ -f "$spec_dir/checklist.md" ]; then
                        status="${GREEN}Ready for Implementation${NC}"
                    else
                        status="${YELLOW}Tasks Created${NC}"
                    fi
                else
                    status="${YELLOW}Plan Created${NC}"
                fi
            else
                status="${RED}Incomplete${NC}"
            fi
            
            echo -e "  • $feature_id - $status"
            
            # Show files present
            [ -f "$spec_dir/spec.md" ] && echo "    ✓ spec.md"
            [ -f "$spec_dir/plan.md" ] && echo "    ✓ plan.md"
            [ -f "$spec_dir/tasks.md" ] && echo "    ✓ tasks.md"
            [ -f "$spec_dir/checklist.md" ] && echo "    ✓ checklist.md"
            echo ""
        fi
    done
}

# Show feature status
show_status() {
    local feature_id=$1
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    
    if [ ! -d "$spec_dir" ]; then
        print_msg "$RED" "❌ Feature not found: $feature_id"
        exit 1
    fi
    
    print_msg "$BLUE" "📊 Status for: $feature_id"
    echo ""
    
    # Check each phase
    echo "Specification Phase:"
    if [ -f "$spec_dir/spec.md" ]; then
        print_msg "$GREEN" "  ✓ spec.md exists"
    else
        print_msg "$RED" "  ✗ spec.md missing"
    fi
    
    echo ""
    echo "Planning Phase:"
    if [ -f "$spec_dir/plan.md" ]; then
        print_msg "$GREEN" "  ✓ plan.md exists"
    else
        print_msg "$RED" "  ✗ plan.md missing"
    fi
    
    echo ""
    echo "Task Breakdown:"
    if [ -f "$spec_dir/tasks.md" ]; then
        print_msg "$GREEN" "  ✓ tasks.md exists"
        
        # Count tasks
        local total_tasks=$(grep -c "^## Task" "$spec_dir/tasks.md" 2>/dev/null || echo "0")
        echo "    Total tasks: $total_tasks"
    else
        print_msg "$RED" "  ✗ tasks.md missing"
    fi
    
    echo ""
    echo "Implementation Readiness:"
    if [ -f "$spec_dir/checklist.md" ]; then
        print_msg "$GREEN" "  ✓ checklist.md exists"
    else
        print_msg "$YELLOW" "  ⚠ checklist.md not generated yet"
    fi
    
    echo ""
    
    # Check constitution alignment
    if [ -f "$PROJECT_ROOT/.specify/memory/constitution.md" ]; then
        print_msg "$GREEN" "✓ Constitution available for reference"
    else
        print_msg "$YELLOW" "⚠ Constitution not found"
    fi
}

# Create new feature
create_feature() {
    local feature_name=$1
    
    print_msg "$BLUE" "🚀 Creating new feature: $feature_name"
    
    # Run the create-new-feature script
    if [ -f "$SCRIPT_DIR/create-new-feature.sh" ]; then
        bash "$SCRIPT_DIR/create-new-feature.sh" "$feature_name"
    else
        print_msg "$RED" "❌ create-new-feature.sh not found"
        exit 1
    fi
}

# Run specification phase
run_specify() {
    local feature_id=$1
    
    print_msg "$BLUE" "📝 Running specification phase for: $feature_id"
    
    # Check if feature exists
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    if [ ! -d "$spec_dir" ]; then
        print_msg "$RED" "❌ Feature not found: $feature_id"
        print_msg "$YELLOW" "💡 Use: $0 new $feature_id to create it first"
        exit 1
    fi
    
    print_msg "$GREEN" "✓ Feature directory found"
    print_msg "$YELLOW" "📝 Please use your AI agent with: /speckit.specify"
    print_msg "$YELLOW" "   This will create spec.md based on the template"
}

# Run planning phase
run_plan() {
    local feature_id=$1
    
    print_msg "$BLUE" "🎯 Running planning phase for: $feature_id"
    
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    
    # Verify spec exists
    if [ ! -f "$spec_dir/spec.md" ] && [ ! -f "$spec_dir/plan.md" ]; then
        print_msg "$RED" "❌ spec.md not found. Run specify phase first."
        exit 1
    fi
    
    print_msg "$GREEN" "✓ Specification found"
    print_msg "$YELLOW" "🎯 Please use your AI agent with: /speckit.plan"
    print_msg "$YELLOW" "   This will create plan.md with architecture and implementation details"
}

# Run task breakdown
run_tasks() {
    local feature_id=$1
    
    print_msg "$BLUE" "📋 Running task breakdown for: $feature_id"
    
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    
    # Verify plan exists
    if [ ! -f "$spec_dir/plan.md" ]; then
        print_msg "$RED" "❌ plan.md not found. Run plan phase first."
        exit 1
    fi
    
    print_msg "$GREEN" "✓ Plan found"
    print_msg "$YELLOW" "📋 Please use your AI agent with: /speckit.tasks"
    print_msg "$YELLOW" "   This will create tasks.md with detailed task breakdown"
}

# Run analysis
run_analyze() {
    local feature_id=$1
    
    print_msg "$BLUE" "🔍 Running consistency analysis for: $feature_id"
    
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    
    # Verify all files exist
    if [ ! -f "$spec_dir/tasks.md" ]; then
        print_msg "$RED" "❌ tasks.md not found. Complete task phase first."
        exit 1
    fi
    
    print_msg "$GREEN" "✓ All required files found"
    print_msg "$YELLOW" "🔍 Please use your AI agent with: /speckit.analyze"
    print_msg "$YELLOW" "   This will analyze consistency across spec, plan, and tasks"
}

# Run checklist generation
run_checklist() {
    local feature_id=$1
    
    print_msg "$BLUE" "✅ Generating checklist for: $feature_id"
    
    local spec_dir="$PROJECT_ROOT/specs/$feature_id"
    
    # Verify tasks exist
    if [ ! -f "$spec_dir/tasks.md" ]; then
        print_msg "$RED" "❌ tasks.md not found. Complete task phase first."
        exit 1
    fi
    
    print_msg "$GREEN" "✓ Tasks found"
    print_msg "$YELLOW" "✅ Please use your AI agent with: /speckit.checklist"
    print_msg "$YELLOW" "   This will create checklist.md for implementation tracking"
}

# Main command handler
main() {
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi
    
    local command=$1
    shift
    
    case "$command" in
        new)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature name required"
                echo "Usage: $0 new <feature-name>"
                exit 1
            fi
            create_feature "$1"
            ;;
        specify)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature ID required"
                exit 1
            fi
            run_specify "$1"
            ;;
        plan)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature ID required"
                exit 1
            fi
            run_plan "$1"
            ;;
        tasks)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature ID required"
                exit 1
            fi
            run_tasks "$1"
            ;;
        analyze)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature ID required"
                exit 1
            fi
            run_analyze "$1"
            ;;
        checklist)
            if [ $# -eq 0 ]; then
                print_msg "$RED" "❌ Feature ID required"
                exit 1
            fi
            run_checklist "$1"
            ;;
        status)
            if [ $# -eq 0 ]; then
                print_msg "$YELLOW" "Showing all features:"
                list_features
            else
                show_status "$1"
            fi
            ;;
        list)
            list_features
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            print_msg "$RED" "❌ Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
