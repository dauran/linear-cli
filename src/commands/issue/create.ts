import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  title: string;
  teamId: string;
  description?: string;
  priority?: number;
  assigneeId?: string;
  stateId?: string;
  labelIds?: string[];
  cycleId?: string;
  dueDate?: string;
  estimate?: number;
  parentId?: string;
  projectId?: string;
  projectMilestoneId?: string;
  subscriberIds?: string[];
  sortOrder?: number;
  prioritySortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new issue.")
  .option("--title <title:string>", "Issue title.", { required: true })
  .option("--team-id <teamId:string>", "Team ID.", { required: true })
  .option("--description <description:string>", "Issue description.")
  .option("--priority <priority:number>", "Priority (0-4).")
  .option("--assignee-id <assigneeId:string>", "Assignee user ID.")
  .option("--state-id <stateId:string>", "State ID.")
  .option("--label-ids <labelIds...:string>", "Label IDs.")
  .option("--cycle-id <cycleId:string>", "Cycle ID.")
  .option("--due-date <dueDate:string>", "Due date (YYYY-MM-DD).")
  .option("--estimate <estimate:number>", "Estimate (complexity points).")
  .option("--parent-id <parentId:string>", "Parent issue ID (for sub-issues).")
  .option("--project-id <projectId:string>", "Project ID.")
  .option(
    "--project-milestone-id <projectMilestoneId:string>",
    "Project milestone ID.",
  )
  .option("--subscriber-ids <subscriberIds...:string>", "Subscriber user IDs.")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .option(
    "--priority-sort-order <prioritySortOrder:number>",
    "Priority sort order.",
  )
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        title: string;
        teamId: string;
        description?: string;
        priority?: number;
        assigneeId?: string;
        stateId?: string;
        labelIds?: string[];
        cycleId?: string;
        dueDate?: string;
        estimate?: number;
        parentId?: string;
        projectId?: string;
        projectMilestoneId?: string;
        subscriberIds?: string[];
        sortOrder?: number;
        prioritySortOrder?: number;
      } = {
        title: options.title,
        teamId: options.teamId,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.priority !== undefined) input.priority = options.priority;
      if (options.assigneeId) input.assigneeId = options.assigneeId;
      if (options.stateId) input.stateId = options.stateId;
      if (options.labelIds) input.labelIds = options.labelIds;
      if (options.cycleId) input.cycleId = options.cycleId;
      if (options.dueDate !== undefined) input.dueDate = options.dueDate;
      if (options.estimate !== undefined) input.estimate = options.estimate;
      if (options.parentId) input.parentId = options.parentId;
      if (options.projectId) input.projectId = options.projectId;
      if (options.projectMilestoneId) {
        input.projectMilestoneId = options.projectMilestoneId;
      }
      if (options.subscriberIds) {
        input.subscriberIds = options.subscriberIds;
      }
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;
      if (options.prioritySortOrder !== undefined) {
        input.prioritySortOrder = options.prioritySortOrder;
      }

      const payload = await client.createIssue(input);
      const issue = await payload.issue;

      if (issue) {
        printJson(
          pick(issue, [
            "id",
            "identifier",
            "title",
            "url",
          ]),
        );
      }
    }),
  );
