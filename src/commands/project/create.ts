import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface CreateOptions {
  name: string;
  teamIds: string[];
  description?: string;
  state?: string;
  leadId?: string;
  startDate?: string;
  targetDate?: string;
  color?: string;
  icon?: string;
  memberIds?: string[];
  priority?: number;
  statusId?: string;
  content?: string;
  sortOrder?: number;
  prioritySortOrder?: number;
}

export const createCommand = new Command()
  .description("Create a new project.")
  .option("--name <name:string>", "Project name.", { required: true })
  .option("--team-ids <teamIds...:string>", "Team IDs.", { required: true })
  .option("--description <description:string>", "Project description.")
  .option("--state <state:string>", "Project state.")
  .option("--lead-id <leadId:string>", "Lead user ID.")
  .option("--start-date <startDate:string>", "Start date (ISO format).")
  .option("--target-date <targetDate:string>", "Target date (ISO format).")
  .option("--color <color:string>", "Project color.")
  .option("--icon <icon:string>", "Project icon.")
  .option("--member-ids <memberIds...:string>", "Member user IDs.")
  .option("--priority <priority:number>", "Priority (0-4).")
  .option("--status-id <statusId:string>", "Project status ID.")
  .option("--content <content:string>", "Project content (markdown).")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .option(
    "--priority-sort-order <prioritySortOrder:number>",
    "Priority sort order.",
  )
  .action(
    handleErrors(async (options: CreateOptions) => {
      const client = getClient();

      const input: {
        name: string;
        teamIds: string[];
        description?: string;
        state?: string;
        leadId?: string;
        startDate?: string;
        targetDate?: string;
        color?: string;
        icon?: string;
        memberIds?: string[];
        priority?: number;
        statusId?: string;
        content?: string;
        sortOrder?: number;
        prioritySortOrder?: number;
      } = {
        name: options.name,
        teamIds: options.teamIds,
      };
      if (options.description !== undefined) {
        input.description = options.description;
      }
      if (options.state !== undefined) input.state = options.state;
      if (options.leadId) input.leadId = options.leadId;
      if (options.startDate) input.startDate = options.startDate;
      if (options.targetDate) input.targetDate = options.targetDate;
      if (options.color !== undefined) input.color = options.color;
      if (options.icon !== undefined) input.icon = options.icon;
      if (options.memberIds) input.memberIds = options.memberIds;
      if (options.priority !== undefined) input.priority = options.priority;
      if (options.statusId) input.statusId = options.statusId;
      if (options.content !== undefined) input.content = options.content;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;
      if (options.prioritySortOrder !== undefined) {
        input.prioritySortOrder = options.prioritySortOrder;
      }

      const payload = await client.createProject(input);
      const project = await payload.project;

      if (project) {
        printJson(pick(project, ["id", "name", "state", "url"]));
      }
    }),
  );
