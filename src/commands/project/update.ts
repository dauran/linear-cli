import { Command } from "@cliffy/command";
import { getClient } from "../../client.ts";
import { pick, printJson } from "../../output.ts";
import { handleErrors } from "../../errors.ts";

interface UpdateOptions {
  name?: string;
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
  teamIds?: string[];
  sortOrder?: number;
  prioritySortOrder?: number;
}

export const updateCommand = new Command()
  .description("Update a project by ID.")
  .arguments("<id:string>")
  .option("--name <name:string>", "New name.")
  .option("--description <description:string>", "New description.")
  .option("--state <state:string>", "New state.")
  .option("--lead-id <leadId:string>", "New lead user ID.")
  .option("--start-date <startDate:string>", "New start date (ISO format).")
  .option("--target-date <targetDate:string>", "New target date (ISO format).")
  .option("--color <color:string>", "Project color.")
  .option("--icon <icon:string>", "Project icon.")
  .option("--member-ids <memberIds...:string>", "Member user IDs.")
  .option("--priority <priority:number>", "Priority (0-4).")
  .option("--status-id <statusId:string>", "Project status ID.")
  .option("--content <content:string>", "Project content (markdown).")
  .option("--team-ids <teamIds...:string>", "Team IDs.")
  .option("--sort-order <sortOrder:number>", "Sort order.")
  .option(
    "--priority-sort-order <prioritySortOrder:number>",
    "Priority sort order.",
  )
  .action(
    handleErrors(async (options: UpdateOptions, id: string) => {
      const client = getClient();

      const input: {
        name?: string;
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
        teamIds?: string[];
        sortOrder?: number;
        prioritySortOrder?: number;
      } = {};
      if (options.name !== undefined) input.name = options.name;
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
      if (options.teamIds) input.teamIds = options.teamIds;
      if (options.sortOrder !== undefined) input.sortOrder = options.sortOrder;
      if (options.prioritySortOrder !== undefined) {
        input.prioritySortOrder = options.prioritySortOrder;
      }

      const payload = await client.updateProject(id, input);
      const project = await payload.project;

      if (project) {
        printJson(pick(project, ["id", "name", "state", "url"]));
      }
    }),
  );
