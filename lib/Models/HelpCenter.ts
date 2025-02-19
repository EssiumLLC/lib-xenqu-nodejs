import { z } from 'zod';

const RecursivePageIndexSchema = z.object({
    label: z.string(),
    id: z.string(),
    type: z.union([z.literal('article'), z.literal('folder')]),
    children: z.array(z.lazy(() => RecursivePageIndexSchema))
})

const HelpCenterSpacesSchema = z.object({
    general_help: z.array(RecursivePageIndexSchema),
    general_help_title: z.string(),
    client_specific_title: z.array(z.string()),
    client_specific: z.array(z.unknown()),
    featured_articles: z.array(z.unknown()),
    location_results: z.array(z.unknown()),
});

const HelpCenterSearchArticleSchema = z.object({
    summary: z.string(),
    id: z.string(),
    title: z.string()
});

const HelpCenterSearchResultsShema = z.object({
    gpt_results: z.array(z.unknown()),
    suggested_articles: z.array(HelpCenterSearchArticleSchema),
    help_results: z.array(HelpCenterSearchArticleSchema),
});

const HelpCenterLlmResultSchema = z.object({
    id: z.string(),
    text_result: z.string(),
    related_articles: z.array(z.object({
        id: z.string(),
        title: z.string(),
    })),
    alternative_terms: z.array(z.string()),
});

const HelpCenterPage = z.object({
    id: z.string(),
    title: z.string(),
    body: z.object({
        styled_view: z.object({
            representation: z.string(),
            value: z.string(),
        }),
    }),
});


export enum HelpCenterAction {
    OpenSession = 'open_session',
    CloseSession = 'close_session',
    OpenArticle = 'open_article',
    CloseArticle = 'close_article',
    SubmitTicket = 'submit_ticket',
    ArticleFeedback = 'article_feedback',
    Search = 'search',
    StaleSession = 'stale_session',
    SessionFault = 'session_fault',
    ContextualHelp = 'contextual_help',
    ViewTab = 'view_tab',
    LLMResponse = 'llm_response',
    LLMFeedback = 'llm_feedback',
}

export type HelpCenterIndex = z.infer<typeof RecursivePageIndexSchema>;
export type HelpCenterSpaces = z.infer<typeof HelpCenterSpacesSchema>;
export type HelpCenterSearchResults = z.infer<typeof HelpCenterSearchResultsShema>;
export type HelpCenterSearchArticle = z.infer<typeof HelpCenterSearchArticleSchema>;
export type HelpCenterLlmResponse = z.infer<typeof HelpCenterLlmResultSchema>;
export type HelpCenterPage = z.infer<typeof HelpCenterPage>;