import openai
import json
from app.config import OPENAI_API_KEY, MODEL
from app.utils.logger import logger
from app.data.prompt import SYSTEM_PROMPT_TEMPLATE
from pydantic import ValidationError
from app.schemas.personal_data import PersonalData

openai.api_key = OPENAI_API_KEY 

def load_personal_data() -> PersonalData:
    with open('app/data/personal_data.json') as f:
        data = json.load(f)
    try:
        personal_data = PersonalData(**data)
        return personal_data
    except ValidationError as e:
        logger.error(f"Validation error while loading personal data: {e}")
        raise e

def create_system_prompt() -> str:
    logger.debug("Creating system prompt.")
    personal_data: PersonalData = load_personal_data()

    # Personal Information
    personal_info = (
        f"Name: {personal_data.name}\n"
        f"Title: {personal_data.title}\n"
        f"Description: {personal_data.description}\n"
    )

    # About Section
    about_section = "About:\n" + "\n".join([f"{i+1}. {para}" for i, para in enumerate(personal_data.about)]) + "\n"

    # Experience Section
    experience_section = "Experience:\n"
    for exp in personal_data.experience:
        experience_section += (
            f"- {exp.date}: **{exp.jobTitle}** at [{exp.company}]({exp.company_link})\n"
            f"  - {exp.description}\n"
            f"  - **Skills:** {', '.join(exp.skills)}\n"
        )
    experience_section += "\n"

    # Certificates Section
    certificates_section = "Certificates:\n"
    for cert in personal_data.certificates:
        certificates_section += (
            f"- {cert.date}: **{cert.jobTitle}** from [{cert.company}]({cert.title_link})\n"
            f"  - {cert.description}\n"
        )
    certificates_section += "\n"

    # Education Section
    education_section = "Education:\n"
    for edu in personal_data.education:
        education_section += (
            f"- **{edu.jobTitle}** from [{edu.company}]({edu.company_link})"
        )
        if edu.description:
            education_section += f" - {edu.description}"
        education_section += "\n"
    education_section += "\n"

    # Projects Section
    projects_section = "Projects:\n"
    for proj in personal_data.projects:
        projects_section += (
            f"- **{proj.title}**: {proj.description}\n"
            f"  - **Technologies:** {', '.join(proj.skills)}\n"
            f"  - **GitHub:** [{proj.github_link}]({proj.github_link})" if proj.github_link else ""
        )
        if proj.link:
            projects_section += f" - **Live Link:** [{proj.link_text}]({proj.link})\n"
        else:
            projects_section += "\n"
    projects_section += "\n"

    # Compile all sections into the system prompt
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        personal_info=personal_info,
        about=about_section,
        experience=experience_section,
        certificates=certificates_section,
        education=education_section,
        projects=projects_section
    )

    return system_prompt

def get_ai_response(conversation: list) -> str:
    try:
        logger.info(f"Sending request to OpenAI API using model '{MODEL}'.")
        response = openai.ChatCompletion.create(
            model=MODEL,
            messages=conversation
        )
        ai_content = response.choices[0].message.content.strip()
        logger.info(f"OpenAI response received. AI response - '{ai_content}'")
        return ai_content
    except Exception as e:
        logger.error(f"Error communicating with OpenAI API - {e}")
        raise e