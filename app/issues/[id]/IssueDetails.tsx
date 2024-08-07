import IssueStatusBadge from '@/app/components/IssueStatusBadge';
import { Issue } from '@prisma/client';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import Markdown from 'react-markdown';

const IssueDetails = ({ issue }: { issue: Issue }) => {
    return (
        <div>
            <Heading>{issue.title}</Heading>
            <Flex className='space-x-3 my-2'>
                <IssueStatusBadge status={issue.status} />
                <Text>{issue.createdAt.toDateString()}</Text>
            </Flex>
            <Card className='prose max-w-full'>
                <Markdown>{issue.description}</Markdown>
            </Card>
        </div>
    )
}

export default IssueDetails