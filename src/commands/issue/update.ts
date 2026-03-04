import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  title?: string;
  description?: string;
  priority?: number;
  assigneeId?: string;
  stateId?: string;
  parentId?: string;
  cycleId?: string;
  dueDate?: string;
  estimate?: number;
  projectId?: string;
  projectMilestoneId?: string;
  labelIds?: string[];
  addedLabelIds?: string[];
  removedLabelIds?: string[];
  subscriberIds?: string[];
  teamId?: string;
  sortOrder?: number;
  prioritySortOrder?: number;
  snoozedUntilAt?: string;
  subIssueSortOrder?: number;
}

export const updateCommand = new Command()
  .description("Update an issue by ID.")
  .arguments("<id:string>")
  .option("--title <title:string>", "New title.")
  .option("--description <description:string>", "New description.")
  .option("--priority <priority:number>", "New priority (0-4).")
  .option("--assignee-id <assigneeId:string>", "New assignee user ID.")
  .option("--state-id <stateId:string>", "New state ID.")
  .option("--parent-id <parentId:string>", "Parent issue ID (for sub-issues).")
  .option("--cycle-id <cycleId:string>", "Cycle ID.")
  .option("--due-date <dueDate:string>", "Due date (YYYY-MM-DD).")
  .option("--estimate <estimate:number>", "Estimate (complexity points).")
  .option("--project-id <projectId:string>", "Project ID.")
  .option(
    "--project-milestone-id <projectMilestoneId:string>",
    "Project milestone ID.",
  )
  .option("--label-ids <labelIds...:string>", "Replace all label IDs.")
  .option("--added-label-ids <addedLabelIds...:string>", "Label IDs to add.")
  .option(
    "--removed-label-ids <removedLabelIds...:string>",
    "Label IDs to remove.",
  )
  .option("--subscriber-ids <subscriberIds...:string>", "Subscriber user IDs.")
  .option("--team-id <teamId:string>", "Move to another team.")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .option(
    "--priority-sort-order <prioritySortOrder:number>",
    "Priority sort order.",
  )
  .option(
    "--snoozed-until-at <snoozedUntilAt:string>",
    "Snooze until (ISO datetime).",
  )
  .option(
    "--sub-issue-sort-order <subIssueSortOrder:number>",
    "Sub-issue sort order.",
  )
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        title?: string;
        description?: string;
        priority?: number;
        assigneeId?: string;
        stateId?: string;
        parentId?: string;
        cycleId?: string;
        dueDate?: string;
        estimate?: number;
        projectId?: string;
        projectMilestoneId?: string;
        labelIds?: string[];
        addedLabelIds?: string[];
        removedLabelIds?: string[];
        subscriberIds?: string[];
        teamId?: string;
        sortOrder?: number;
        prioritySortOrder?: number;
        snoozedUntilAt?: Date;
        subIssueSortOrder?: number;
      } = {};
      if (options.title !== undefined) input.title = options.title;
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.priority !== undefined) input.priority = options.priority;
      if (options.assigneeId) input.assigneeId = options.assigneeId;
      if (options.stateId) input.stateId = options.stateId;
      if (options.parentId) input.parentId = options.parentId;
      if (options.cycleId) input.cycleId = options.cycleId;
      if (options.dueDate !== undefined) input.dueDate = options.dueDate;
      if (options.estimate !== undefined) input.estimate = options.estimate;
      if (options.projectId) input.projectId = options.projectId;
      if (options.projectMilestoneId) {
        input.projectMilestoneId = options.projectMilestoneId;
      }
      if (options.labelIds) input.labelIds = options.labelIds;
      if (options.addedLabelIds) input.addedLabelIds = options.addedLabelIds;
      if (options.removedLabelIds) {
        input.removedLabelIds = options.removedLabelIds;
      }
      if (options.subscriberIds) {
        input.subscriberIds = options.subscriberIds;
      }
      if (options.teamId) input.teamId = options.teamId;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;
      if (options.prioritySortOrder !== undefined) {
        input.prioritySortOrder = options.prioritySortOrder;
      }
      if (options.snoozedUntilAt) {
        input.snoozedUntilAt = new Date(options.snoozedUntilAt);
      }
      if (options.subIssueSortOrder !== undefined) {
        input.subIssueSortOrder = options.subIssueSortOrder;
      }

      const payload = await client.updateIssue(id, input);
      const issue = await payload.issue;

      if (issue) {
        printJson(issue);
      }
    }),
  );
