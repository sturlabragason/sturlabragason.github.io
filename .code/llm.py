# Main function to run the workflow
def main():
    send_code_to_llm_agent()
    predict_and_save_expected_outcome()
    execute_terraform_init_and_plan()
    interpret_output()

    error_found = check_for_error()

    if error_found:
        locate_error_and_query_docs()
        fix_error_and_push_commit()
        main()  # Start the process over from Step A
    else:
        outcomes_match = compare_expected_and_interpreted_outcomes()
        
        if outcomes_match:
            execute_terraform_apply()
        else:
            print("The outcomes don't match. Further investigation required.")

# Run the main function
if __name__ == "__main__":
    main()